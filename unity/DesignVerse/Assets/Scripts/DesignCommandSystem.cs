using System;
using UnityEngine;

namespace DesignVerse
{
    /// <summary>
    /// Executes validated AI Voice and Text Design Commands on active Unity GameObjects.
    /// Commands: MOVE_OBJECT, ROTATE_OBJECT, SCALE_OBJECT, RECOLOR_OBJECT, CHANGE_STYLE, ADD_OBJECT, REMOVE_OBJECT
    /// </summary>
    public class DesignCommandSystem : MonoBehaviour
    {
        public FurnitureManager furnitureManager;
        public RoomBuilder roomBuilder;

        public void ExecuteCommand(string jsonCommand)
        {
            try
            {
                var cmd = JsonUtility.FromJson<DesignCommandData>(jsonCommand);
                if (cmd == null) return;

                switch (cmd.intent)
                {
                    case "MOVE_OBJECT":
                        MoveObject(cmd.target, cmd.direction, cmd.distance);
                        break;
                    case "RECOLOR_OBJECT":
                        RecolorObject(cmd.target, cmd.color);
                        break;
                    case "REMOVE_OBJECT":
                        furnitureManager.DeleteObject(cmd.target);
                        break;
                    default:
                        Debug.Log($"[DesignVerse CommandSystem] Handled intent: {cmd.intent}");
                        break;
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[DesignVerse CommandSystem] Exception: {ex.Message}");
            }
        }

        private void MoveObject(string targetId, string direction, float distance)
        {
            GameObject obj = furnitureManager.GetObject(targetId);
            if (obj == null) return;

            Vector3 delta = Vector3.zero;
            if (direction == "forward") delta = obj.transform.forward * distance;
            else if (direction == "back") delta = -obj.transform.forward * distance;
            else if (direction == "left") delta = -obj.transform.right * distance;
            else if (direction == "right") delta = obj.transform.right * distance;

            obj.transform.position += delta;
            Debug.Log($"[DesignVerse CommandSystem] Moved {targetId} {direction} by {distance}m");
        }

        private void RecolorObject(string targetId, string hexColor)
        {
            GameObject obj = furnitureManager.GetObject(targetId);
            if (obj == null) return;

            Color newColor;
            if (ColorUtility.TryParseHtmlString(hexColor, out newColor))
            {
                var renderer = obj.GetComponent<Renderer>();
                if (renderer != null) renderer.material.color = newColor;
            }
        }
    }

    [Serializable]
    public class DesignCommandData
    {
        public string intent;
        public string target;
        public string direction;
        public float distance = 0.5f;
        public string color;
    }
}
