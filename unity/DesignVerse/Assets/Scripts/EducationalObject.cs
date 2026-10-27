using UnityEngine;

namespace DesignVerse
{
    /// <summary>
    /// DESIGNVERSE KIDS — EDUCATIONAL OBJECT COMPONENT
    /// Attached to every room element and furniture piece in Educational Mode.
    /// Stores child-friendly descriptions, usage hints, shapes, and interaction states.
    /// </summary>
    public class EducationalObject : MonoBehaviour
    {
        [Header("Educational Metadata")]
        public string objectId;
        public string category;             // "floor", "wall", "ceiling", "door", "window", "chair", "table", "bed", "sofa", "lamp"
        public string friendlyName;         // e.g. "Comfy Chair", "Sunny Window", "Main Door"
        public string usageDescription;     // e.g. "A chair is used for sitting comfortably."
        public string shapeType;            // "rectangle", "circle", "square", "cylinder"
        public int requiredLevel = 1;

        [Header("Interaction State")]
        public bool isSelectable = true;
        public bool isHighlighted = false;
        public bool isTargetOfCurrentLesson = false;

        private Renderer objRenderer;
        private Color originalColor;
        private bool hasOriginalColor = false;

        private void Awake()
        {
            objRenderer = GetComponent<Renderer>();
            if (objRenderer != null && objRenderer.material != null)
            {
                originalColor = objRenderer.material.color;
                hasOriginalColor = true;
            }
        }

        public void SetHighlight(bool enable, Color highlightColor)
        {
            isHighlighted = enable;
            if (objRenderer != null && objRenderer.material != null)
            {
                if (enable)
                {
                    objRenderer.material.color = highlightColor;
                }
                else if (hasOriginalColor)
                {
                    objRenderer.material.color = originalColor;
                }
            }
        }

        public void OnKidTapped()
        {
            Debug.Log($"[EducationalObject] Kid tapped on {friendlyName} ({category})");
            if (LessonInteractionManager.Instance != null)
            {
                LessonInteractionManager.Instance.OnObjectTapped(this);
            }
        }
    }
}
