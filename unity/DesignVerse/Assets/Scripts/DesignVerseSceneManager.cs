using System;
using System.Collections.Generic;
using UnityEngine;

namespace DesignVerse
{
    /// <summary>
    /// DESIGNVERSE — MASTER UNITY SCENE MANAGER
    /// Coordinates 3D room construction, real GameObject spawning, spatial graph processing,
    /// scene serialization, and AI voice command execution inside Unity.
    /// </summary>
    public class DesignVerseSceneManager : MonoBehaviour
    {
        public static DesignVerseSceneManager Instance { get; private set; }

        [Header("Engine Subsystems")]
        public RoomBuilder roomBuilder;
        public FurnitureManager furnitureManager;
        public ObjectSelectionManager selectionManager;
        public ObjectTransformManager transformManager;
        public MaterialManager materialManager;
        public LightingManager lightingManager;
        public CameraManager cameraManager;
        public DesignCommandSystem commandSystem;
        public UnityBridgeService bridgeService;

        public string CurrentSceneId { get; private set; }
        public string CurrentProjectId { get; private set; }

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void Start()
        {
            Debug.Log("[DesignVerse] Unity 3D Engine Initialized. Ready for Room3DScene JSON.");
        }

        /// <summary>
        /// Main Entrypoint: Reconstructs a full 3D room from structured JSON.
        /// Every detected furniture piece becomes an independent, editable GameObject.
        /// </summary>
        public void LoadRoom3DScene(string jsonPayload)
        {
            try
            {
                var sceneData = JsonUtility.FromJson<Room3DSceneData>(jsonPayload);
                if (sceneData == null)
                {
                    Debug.LogError("[DesignVerse] Failed to parse Room3DScene JSON payload.");
                    return;
                }

                CurrentSceneId = sceneData.sceneId;
                CurrentProjectId = sceneData.projectId;

                // 1. Construct Architectural Shell (Floor, Walls, Ceiling, Doors, Windows)
                roomBuilder.BuildRoom(sceneData.room, sceneData.architecture);

                // 2. Instantiate Real Furniture GameObjects
                furnitureManager.SpawnFurnitureObjects(sceneData.objects);

                // 3. Configure Lighting & Camera
                lightingManager.ApplyLighting(sceneData.lighting);
                cameraManager.SetCameraMode("Orbit");

                Debug.Log($"[DesignVerse] Successfully loaded Room3DScene {CurrentSceneId} with {sceneData.objects.Count} editable objects.");
            }
            catch (Exception ex)
            {
                Debug.LogError($"[DesignVerse] Exception during LoadRoom3DScene: {ex.Message}");
            }
        }
    }

    [Serializable]
    public class Room3DSceneData
    {
        public string schemaVersion = "2.0";
        public string sceneId;
        public string projectId;
        public RoomGeometryData room;
        public ArchitectureData architecture;
        public List<RoomObjectData> objects;
        public LightingData lighting;
    }

    [Serializable]
    public class RoomGeometryData
    {
        public float width = 6.0f;
        public float length = 5.0f;
        public float height = 2.8f;
        public string wallColor = "#20222e";
        public string floorType = "hardwood";
        public string floorColor = "#4a3525";
    }

    [Serializable]
    public class ArchitectureData
    {
        public List<WallData> walls;
        public List<OpeningData> doors;
        public List<OpeningData> windows;
    }

    [Serializable]
    public class WallData
    {
        public string id;
        public string type;
        public float x1, z1, x2, z2;
    }

    [Serializable]
    public class OpeningData
    {
        public string id;
        public string wallId;
        public float width, height;
    }

    [Serializable]
    public class RoomObjectData
    {
        public string id;
        public string category;
        public string name;
        public string assetId;
        public float[] position;
        public float[] rotation;
        public float[] scale;
        public float[] dimensions;
        public string material;
        public string color;
    }

    [Serializable]
    public class LightingData
    {
        public float intensity = 1.25f;
        public string color = "#FFF1DD";
        public string preset = "daylight";
    }
}
