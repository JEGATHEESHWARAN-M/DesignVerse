using UnityEngine;

namespace DesignVerse
{
    /// <summary>
    /// Constructs procedural architectural shell (Floor, Ceiling, Walls, Openings) inside Unity.
    /// </summary>
    public class RoomBuilder : MonoBehaviour
    {
        [Header("Materials")]
        public Material wallMaterial;
        public Material floorMaterial;
        public Material ceilingMaterial;

        private GameObject roomContainer;

        public void BuildRoom(RoomGeometryData room, ArchitectureData arch)
        {
            if (roomContainer != null) Destroy(roomContainer);
            roomContainer = new GameObject("Room");

            // 1. Create Floor Plane
            GameObject floor = GameObject.CreatePrimitive(PrimitiveType.Plane);
            floor.name = "Floor";
            floor.transform.SetParent(roomContainer.transform);
            floor.transform.position = Vector3.zero;
            floor.transform.localScale = new Vector3(room.width / 10.0f, 1.0f, room.length / 10.0f);

            // 2. Create Ceiling Plane
            GameObject ceiling = GameObject.CreatePrimitive(PrimitiveType.Plane);
            ceiling.name = "Ceiling";
            ceiling.transform.SetParent(roomContainer.transform);
            ceiling.transform.position = new Vector3(0, room.height, 0);
            ceiling.transform.rotation = Quaternion.Euler(180, 0, 0);
            ceiling.transform.localScale = new Vector3(room.width / 10.0f, 1.0f, room.length / 10.0f);

            // 3. Create Walls (Back, Left, Right, Front)
            CreateWall("Wall_Back", new Vector3(0, room.height / 2.0f, -room.length / 2.0f), new Vector3(room.width, room.height, 0.1f));
            CreateWall("Wall_Left", new Vector3(-room.width / 2.0f, room.height / 2.0f, 0), new Vector3(0.1f, room.height, room.length));
            CreateWall("Wall_Right", new Vector3(room.width / 2.0f, room.height / 2.0f, 0), new Vector3(0.1f, room.height, room.length));

            Debug.Log($"[DesignVerse RoomBuilder] Constructed room shell ({room.width}m x {room.length}m x {room.height}m)");
        }

        private void CreateWall(string name, Vector3 pos, Vector3 scale)
        {
            GameObject wall = GameObject.CreatePrimitive(PrimitiveType.Cube);
            wall.name = name;
            wall.transform.SetParent(roomContainer.transform);
            wall.transform.position = pos;
            wall.transform.localScale = scale;
        }
    }
}
