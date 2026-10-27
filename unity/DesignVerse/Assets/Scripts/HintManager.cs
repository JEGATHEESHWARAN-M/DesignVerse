using System;
using System.Collections.Generic;
using UnityEngine;

namespace DesignVerse
{
    /// <summary>
    /// DESIGNVERSE KIDS — THREE-TIER PROGRESSIVE HINT MANAGER
    /// Provides staged hints (General Clue -> Directional Guide -> Concrete Action)
    /// without immediately solving the spatial puzzle for the child.
    /// </summary>
    public class HintManager : MonoBehaviour
    {
        public static HintManager Instance { get; private set; }

        private int currentHintTier = 0;
        private string activeChallengeId = "";

        private readonly Dictionary<string, string[]> challengeHints = new Dictionary<string, string[]>
        {
            {
                "ch_door_clearance",
                new string[]
                {
                    "💡 Hint 1: Look closely at the main door! Can someone walk through right now?",
                    "💡 Hint 2: One piece of furniture is too close to the doorway. See if you can find it!",
                    "💡 Hint 3: Move the chair away from the door and place it neatly beside the desk!"
                }
            },
            {
                "ch_chair_puzzle",
                new string[]
                {
                    "💡 Hint 1: People sit in chairs when they eat or do homework at a table!",
                    "💡 Hint 2: Try pulling the chair towards the dining table.",
                    "💡 Hint 3: Place the chair right in front of the table so our room buddy can sit!"
                }
            },
            {
                "ch_find_door_floor",
                new string[]
                {
                    "💡 Hint 1: The floor is right beneath your feet!",
                    "💡 Hint 2: Look around the walls to see where you would leave the room.",
                    "💡 Hint 3: Tap the tall door with the handle in the wall!"
                }
            }
        };

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void SetChallenge(string challengeId)
        {
            activeChallengeId = challengeId;
            currentHintTier = 0;
        }

        public string GetNextHint()
        {
            if (!challengeHints.ContainsKey(activeChallengeId))
            {
                return "💡 Think about how people use and walk through this room!";
            }

            var hints = challengeHints[activeChallengeId];
            if (currentHintTier < hints.Length)
            {
                string hint = hints[currentHintTier];
                currentHintTier++;
                return hint;
            }

            return hints[hints.Length - 1]; // Return final hint if repeated
        }

        public void ResetHints()
        {
            currentHintTier = 0;
        }
    }
}
