using System.Collections.Generic;
using UnityEngine;

namespace DesignVerse
{
    /// <summary>
    /// Manages spawning, tracking, selection, mutation, and destruction of real 3D Furniture GameObjects.
    /// </summary>
    public class FurnitureManager : MonoBehaviour
    {
        private GameObject furnitureContainer;
        private Dictionary<string, GameObject> activeObjects = new Dictionary<string, GameObject>();

        public void SpawnFurnitureObjects(List<RoomObjectData> objects)
        {
            if (furnitureContainer != null) Destroy(furnitureContainer);
            furnitureContainer = new GameObject("Furniture");
            activeObjects.Clear();

            foreach (var objData in objects)
            {
                SpawnObject(objData);
            }

            Debug.Log($"[DesignVerse FurnitureManager] Spawned {activeObjects.Count} real furniture GameObjects.");
        }

        public GameObject SpawnObject(RoomObjectData data)
        {
            // Create procedural primitive fallback if prefab asset is not loaded
            PrimitiveType primType = PrimitiveType.Cube;
            if (data.category == "bed" || data.category == "sofa" || data.category == "table") primType = PrimitiveType.Cube;
            else if (data.category == "plant" || data.category == "lamp") primType = PrimitiveType.Cylinder;

            GameObject obj = GameObject.CreatePrimitive(primType);
            obj.name = $"{data.category}_{data.id}";
            obj.transform.SetParent(furnitureContainer.transform);

            // Set Transform
            if (data.position != null && data.position.Length == 3)
                obj.transform.position = new Vector3(data.position[0], data.position[1] + (data.dimensions[1] / 2.0f), data.position[2]);
            
            if (data.dimensions != null && data.dimensions.Length == 3)
                obj.transform.localScale = new Vector3(data.dimensions[0], data.dimensions[1], data.dimensions[2]);

            // Add Collider & Tag for Raycast Selection
            if (obj.GetComponent<Collider>() == null) obj.AddComponent<BoxCollider>();
            obj.tag = "SelectableFurniture";

            activeObjects[data.id] = obj;
            return obj;
        }

        public GameObject GetObject(string id)
        {
            return activeObjects.ContainsKey(id) ? activeObjects[id] : null;
        }

        public void DeleteObject(string id)
        {
            if (activeObjects.ContainsKey(id))
            {
                Destroy(activeObjects[id]);
                activeObjects.Remove(id);
            }
        }
    }
}
