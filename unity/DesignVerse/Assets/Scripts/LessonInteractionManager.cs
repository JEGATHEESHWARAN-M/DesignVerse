using System;
using UnityEngine;

namespace DesignVerse
{
    /// <summary>
    /// DESIGNVERSE KIDS — LESSON INTERACTION MANAGER
    /// Validates real-time child interactions with 3D objects against active lesson targets.
    /// Emits progress events back to JavaScript / Flutter / Web bridge.
    /// </summary>
    public class LessonInteractionManager : MonoBehaviour
    {
        public static LessonInteractionManager Instance { get; private set; }

        [Header("Active Lesson Context")]
        public string currentLessonId = "l1_what_is_a_room";
        public string currentTargetCategory = "floor";
        public int currentStepIndex = 0;

        public event Action<string, bool, string> OnInteractionResult; // lessonId, isSuccess, feedback

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void SetTarget(string lessonId, string targetCategory, int stepIndex)
        {
            currentLessonId = lessonId;
            currentTargetCategory = targetCategory.ToLower();
            currentStepIndex = stepIndex;
            Debug.Log($"[LessonInteraction] New target set: {currentTargetCategory} for lesson {lessonId} (step {stepIndex})");
        }

        public void OnObjectTapped(EducationalObject obj)
        {
            if (obj == null) return;

            bool isCorrect = (obj.category.ToLower() == currentTargetCategory);
            string feedback;

            if (isCorrect)
            {
                feedback = $"⭐ Great job! You found the {obj.friendlyName}!";
                if (LearningHighlightManager.Instance != null)
                {
                    LearningHighlightManager.Instance.FlashSuccess(obj);
                }
            }
            else
            {
                feedback = $"Almost! That's the {obj.friendlyName}. Look around for the {currentTargetCategory}!";
            }

            Debug.Log($"[LessonInteraction] Result: {isCorrect}. {feedback}");
            OnInteractionResult?.Invoke(currentLessonId, isCorrect, feedback);

            // Notify Web/Flutter bridge
            NotifyWebBridge(isCorrect, feedback, obj.category);
        }

        private void NotifyWebBridge(bool success, string feedback, string objectCategory)
        {
            string payload = $"{{\"lesson_id\":\"{currentLessonId}\",\"success\":{(success ? "true" : "false")},\"feedback\":\"{feedback}\",\"category\":\"{objectCategory}\"}}";
            Debug.Log($"[LessonInteraction] Sending to Web Bridge: {payload}");
#if UNITY_WEBGL && !UNITY_EDITOR
            // External eval / JS call hook
#endif
        }
    }
}
