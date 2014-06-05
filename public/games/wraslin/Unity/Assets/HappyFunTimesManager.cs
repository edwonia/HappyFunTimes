//using UnityEngine;
//using System.Collections;
//using HappyFunTimes;
//
//public class HappyFunTimesManager : MonoBehaviour {
//
//	GameServer.Options options;
//	GameServer m_server;
//	
//
//	void Start () 
//	{
//		GameServer.Options options = new GameServer.Options();
//		options.gameId = "simple";
//		m_server = new GameServer(options, gameObject);
//		m_server.Init();
//
//		StartEvents();
//
//	}
//
//	void StartEvents ()
//	{
//		m_server.OnPlayerConnect += StartNewPlayer;
////		m_server.OnConnect += Connected;
////		m_server.OnDisconnect += Remove;
//	}
//
////	private void Remove(object sender, EventArgs e) {
////		Destroy(gameObject);
////	}
//	
//
//	void StartNewPlayer (object sender, PlayerConnectMessageArgs e)
//	{
//		// Spawn a new player then add a script to it.
//		Vector3 pos = new Vector3(0,0,0);
//		GameObject gameObject = (GameObject)Instantiate(Resources.Load("player"), pos, Quaternion.identity);
//
//	}
//	
//
//	void Update () 
//	{
//	
//	}
//
//}
