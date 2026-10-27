using UnityEngine;

namespace DesignVerse
{
    /// <summary>
    /// REST / WebGL / WebSocket Bridge communicating between Web app/Flutter and Unity.
    /// Exposes JavaScript window interface (UnityLoader / SendMessage) for real-time scene updates.
    /// </summary>
    public class UnityBridgeService : MonoBehaviour
    {
        public DesignVerseSceneManager sceneManager;

        // Called from JavaScript / Flutter via SendMessage("UnityBridge", "OnReceiveRoom3DScene", jsonPayload)
        public void OnReceiveRoom3DScene(string jsonPayload)
        {
            Debug.Log("[UnityBridge] Received Room3DScene payload from Web/Flutter.");
            if (sceneManager != null)
            {
                sceneManager.LoadRoom3DScene(jsonPayload);
            }
        }

        // Called from JavaScript / Flutter via SendMessage("UnityBridge", "OnReceiveVoiceCommand", jsonCommand)
        public void OnReceiveVoiceCommand(string jsonCommand)
        {
            Debug.Log("[UnityBridge] Received Voice Command from Web/Flutter.");
            if (sceneManager != null && sceneManager.commandSystem != null)
            {
                sceneManager.commandSystem.ExecuteCommand(jsonCommand);
            }
        }

        // Called from JavaScript / Flutter via SendMessage("UnityBridge", "OnSetLearningLevel", levelNumber)
        public void OnSetLearningLevel(int level)
        {
            Debug.Log($"[UnityBridge] Setting Learning Level: {level}");
            if (LearningSceneManager.Instance != null)
            {
                LearningSceneManager.Instance.SetLevel(level);
            }
        }

        // Called from JavaScript / Flutter via SendMessage("UnityBridge", "OnStartLesson", jsonPayload)
        public void OnStartLesson(string jsonPayload)
        {
            Debug.Log($"[UnityBridge] Starting Lesson: {jsonPayload}");
            // jsonPayload: {"lesson_id":"l1_what_is_a_room","target":"floor"}
        }
    }
}
