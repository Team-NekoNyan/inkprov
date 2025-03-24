import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase";

interface RedeemCodeProps {
  isRedeeming: boolean;
  setIsRedeeming: React.Dispatch<React.SetStateAction<boolean>>;
}

// Map to link redemption codes to the appripriate stat in user_gamification_stats
const CODE_TO_STAT_MAPPING: Record<string, string> = {
  CC37DEMODAY: "attended_demo_day",
};

const RedeemCode: React.FC<RedeemCodeProps> = ({ setIsRedeeming }) => {
  const [code, setCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Please enter a redemption code");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if we have a mapping for this code
      const normalizedCode = code.trim().toUpperCase();
      const statColumn = CODE_TO_STAT_MAPPING[normalizedCode];

      if (!statColumn) {
        throw new Error("Invalid code");
      }

      if (!user) {
        throw new Error("You must be logged in to redeem a code");
      }

      // Check if user has already redeemed this code by looking at their stats
      const { data: userStats, error: userStatsError } = await supabase
        .from("user_gamification_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (userStatsError && userStatsError.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        throw new Error("Error checking redemption status");
      }

      // If user has already redeemed this code
      if (userStats && userStats[statColumn] === 1) {
        throw new Error("You have already redeemed this code");
      }

      // Prepare update data
      const updateData: Record<string, any> = {};
      updateData[statColumn] = 1;

      if (userStats) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("user_gamification_stats")
          .update(updateData)
          .eq("user_id", user.id);

        if (updateError) {
          console.error("Update error:", updateError);
          throw new Error("Failed to update gamification stats");
        }
      } else {
        // Insert new record
        updateData.user_id = user.id;
        const { error: insertError } = await supabase
          .from("user_gamification_stats")
          .insert([updateData]);

        if (insertError) {
          console.error("Insert error:", insertError);
          throw new Error("Failed to update gamification stats");
        }
      }

      // Success response
      toast.success("Code redeemed successfully! Reward unlocked.");
      setCode("");
      setIsRedeeming(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to redeem code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCode("");
    setIsRedeeming(false);
  };

  return (
    <div className="flex flex-col space-y-4 p-2">
      <h3 className="text-lg font-medium text-primary-text">Redeem Code</h3>
      <p className="text-sm text-secondary-text">
        Enter your redemption code to unlock exclusive content and rewards.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code"
            className="w-full mt-1 px-4 py-2 border border-primary-border rounded-md bg-white text-primary-text focus:ring-primary-button focus:border-primary-button"
            disabled={isSubmitting}
            autoComplete="off"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-button hover:bg-primary-button-hover text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redeeming...
              </>
            ) : (
              "Redeem"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="border-primary-border text-primary-text hover:bg-accent"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RedeemCode;
