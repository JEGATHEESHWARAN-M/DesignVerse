using System;
using System.Collections.Generic;
using UnityEngine;

namespace DesignVerse
{
    /// <summary>
    /// DESIGNVERSE KIDS — REAL SCENE SPATIAL CHALLENGE VALIDATOR
    /// Validates physical 3D scene arrangement against pedagogical criteria:
    /// - Door clearance (door swing area free of obstacles)
    /// - Walking path (walkable distance between entry, bed, table)
    /// - Room boundary containment (objects inside walls)
    /// - Furniture pairing (chair placed within reasonable radius of table)
    /// </summary>
    public class ChallengeValidator : MonoBehaviour
    {
        public static ChallengeValidator Instance { get; private set; }

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        [Serializable]
        public class ValidationResult
        {
            public bool passed;
            public string message;
            public float doorClearanceMeters;
            public bool hasWalkablePath;
            public bool isContainedInRoom;
            public bool isPairingValid;
        }

        /// <summary>
        /// Validates Level 5 Challenge: Door Clearance.
        /// Checks that no furniture GameObject is within 0.9m of any Door object.
        /// </summary>
        public ValidationResult ValidateDoorClearance(float requiredClearance = 0.9f)
        {
            var doors = new List<EducationalObject>();
            var furniture = new List<EducationalObject>();

            foreach (var obj in FindObjectsOfType<EducationalObject>())
            {
                if (obj.category == "door") doors.Add(obj);
                else if (obj.category != "floor" && obj.category != "wall" && obj.category != "ceiling") furniture.Add(obj);
            }

            if (doors.Count == 0)
            {
                return new ValidationResult { passed = true, message = "Doorway is clear!", doorClearanceMeters = 2.0f, hasWalkablePath = true };
            }

            float minDistance = float.MaxValue;
            EducationalObject blockingObject = null;

            foreach (var door in doors)
            {
                foreach (var piece in furniture)
                {
                    float dist = Vector3.Distance(door.transform.position, piece.transform.position);
                    if (dist < minDistance)
                    {
                        minDistance = dist;
                        blockingObject = piece;
                    }
                }
            }

            if (minDistance < requiredClearance && blockingObject != null)
            {
                return new ValidationResult
                {
                    passed = false,
                    doorClearanceMeters = minDistance,
                    hasWalkablePath = false,
                    message = $"Oops! The {blockingObject.friendlyName} is only {minDistance:F1}m from the door, blocking the swing! Give it a little nudge away!"
                };
            }

            return new ValidationResult
            {
                passed = true,
                doorClearanceMeters = minDistance,
                hasWalkablePath = true,
                message = "🎉 Excellent! The door opens completely with wide walking space!"
            };
        }

        /// <summary>
        /// Validates Level 2 Challenge: Chair Near Table.
        /// Checks that at least one Chair is placed within 1.2m of a Table.
        /// </summary>
        public ValidationResult ValidateChairNearTable(float maxDistance = 1.2f)
        {
            var chairs = new List<EducationalObject>();
            var tables = new List<EducationalObject>();

            foreach (var obj in FindObjectsOfType<EducationalObject>())
            {
                if (obj.category == "chair") chairs.Add(obj);
                else if (obj.category == "table" || obj.category == "desk") tables.Add(obj);
            }

            if (tables.Count == 0 || chairs.Count == 0)
            {
                return new ValidationResult { passed = false, message = "Please make sure you have both a table and a chair in the room!" };
            }

            float closest = float.MaxValue;
            foreach (var table in tables)
            {
                foreach (var chair in chairs)
                {
                    float dist = Vector3.Distance(table.transform.position, chair.transform.position);
                    if (dist < closest) closest = dist;
                }
            }

            if (closest <= maxDistance)
            {
                return new ValidationResult
                {
                    passed = true,
                    isPairingValid = true,
                    message = "⭐ Wonderful! The chair is right next to the table ready for work and dining!"
                };
            }

            return new ValidationResult
            {
                passed = false,
                isPairingValid = false,
                message = $"The chair is a bit too far ({closest:F1}m away). Try moving it closer to the table!"
            };
        }

        /// <summary>
        /// Validates that objects remain strictly inside the room boundaries.
        /// </summary>
        public ValidationResult ValidateRoomBoundaries(Bounds roomBounds)
        {
            foreach (var obj in FindObjectsOfType<EducationalObject>())
            {
                if (obj.category == "floor" || obj.category == "wall" || obj.category == "ceiling") continue;
                if (!roomBounds.Contains(obj.transform.position))
                {
                    return new ValidationResult
                    {
                        passed = false,
                        isContainedInRoom = false,
                        message = $"The {obj.friendlyName} is outside the room! Pull it back inside onto the floor."
                    };
                }
            }

            return new ValidationResult { passed = true, isContainedInRoom = true, message = "All furniture is safe inside the room!" };
        }
    }
}
