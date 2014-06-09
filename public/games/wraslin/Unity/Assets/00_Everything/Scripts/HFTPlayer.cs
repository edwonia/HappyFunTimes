using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using HappyFunTimes;
using CSSParse;

namespace HappyFunTimesExample {

	class HFTPlayer : MonoBehaviour {

		public float moveSpeed = 2;
		public float flyingTime = 1;
		public float flyingSpeed = 2;
		public float m_strength = 1;
		public float m_initialScale = 210;

		private Animator anim;
		private TextMesh text;

	    // Classes based on MessageCmdData are automatically registered for deserialization
	    // by CmdName.
	    [CmdName("color")]
	    private class MessageColor : MessageCmdData {
	        public string color = "";    // in CSS format rgb(r,g,b)
	    };

	    [CmdName("setName")]
	    private class MessageSetName : MessageCmdData {
	        public MessageSetName() {  // needed for deserialization
	        }
	        public MessageSetName(string _name) {
	            name = _name;
	        }
	        public string name = "";
	    };

	    [CmdName("busy")]
	    private class MessageBusy : MessageCmdData {
	        public bool busy = false;
	    }

		[CmdName("moveLeft")]
		private class MessageMoveLeft : MessageCmdData {
			public bool down = true;
		};

		[CmdName("moveRight")]
		private class MessageMoveRight : MessageCmdData {
			public bool down = true;
		};

		[CmdName("moveDown")]
		private class MessageMoveDown : MessageCmdData {
			public bool down = true;
		};

		[CmdName("moveUp")]
		private class MessageMoveUp : MessageCmdData {
			public bool down = true;
		};

		[CmdName("flying")]
		private class MessageFlying : MessageCmdData {
			public bool down = true;
		};

		[CmdName("strength")]
		private class MessageStrength : MessageCmdData {
			public float strength = 1;   
		};

		[CmdName("fight")]
		private class MessageFight : MessageCmdData {
			public bool down = true;
		};
		
		// NOTE: This message is only sent, never received
	    // therefore it does not need a no parameter constructor.
	    // If you do receive one you'll get an error unless you
	    // add a no parameter constructor.
	    [CmdName("scored")]
	    private class MessageScored : MessageCmdData {
	        public MessageScored(int _points) {
	            points = _points;
	        }

	        public int points;
	    }

		[CmdName("die")]
		private class MessageDie : MessageCmdData {
			public MessageDie() {

			}
		}

	    public void Init(NetPlayer netPlayer) {
	        m_netPlayer = netPlayer;
	        m_name = "Player" + (++s_nextPlayerId);
	    }

	    void Start() {
			anim = GetComponent<Animator>();
			text = transform.GetChild(0).GetComponent<TextMesh>();
	        m_rand = new System.Random();
	        m_position = gameObject.transform.localPosition;
	        m_color = new Color(0.0f, 1.0f, 0.0f);
	        m_netPlayer.OnDisconnect += Remove;
	        // Setup events for the different messages.
	        m_netPlayer.RegisterCmdHandler<MessageColor>(OnColor);
	        m_netPlayer.RegisterCmdHandler<MessageSetName>(OnSetName);
	        m_netPlayer.RegisterCmdHandler<MessageBusy>(OnBusy);
			m_netPlayer.RegisterCmdHandler<MessageMoveLeft>(OnMoveLeft);
			m_netPlayer.RegisterCmdHandler<MessageMoveRight>(OnMoveRight);
			m_netPlayer.RegisterCmdHandler<MessageMoveDown>(OnMoveDown);
			m_netPlayer.RegisterCmdHandler<MessageMoveUp>(OnMoveUp);
			m_netPlayer.RegisterCmdHandler<MessageFlying>(OnFlying);
			m_netPlayer.RegisterCmdHandler<MessageStrength>(OnStrength);
			m_netPlayer.RegisterCmdHandler<MessageFight>(OnFight);

	    }

	    public void Update() {

			text.text = m_name;

			if (moveLeft)
			{
				transform.position += new Vector3(-moveSpeed,0,0);
//				GetComponent<Animator>().SetFloat("Speed", 1);
				anim.SetFloat("speed",1);
			}	
			if (moveRight)
			{
				transform.position += new Vector3(moveSpeed,0,0);
				anim.SetFloat("speed",1);
			}
			if (moveDown)
			{
				transform.position += new Vector3(0,-moveSpeed,0);
				anim.SetFloat("speed",1);
			}
			if (moveUp)
			{
				transform.position += new Vector3(0,moveSpeed,0);
				anim.SetFloat("speed",1);
			}

			// if not pressing on the dpad stand still
			if (!moveLeft && !moveRight && !moveDown && !moveUp)
			{
				anim.SetFloat ("speed",0);
			}

			if (flying)
			{
				if (transform.localScale.x > 0)
				{
					transform.position += new Vector3(flyingSpeed,0,0);
				} else {
					transform.position -= new Vector3(flyingSpeed,0,0);
				}
			}


			
		}

	    public void OnTriggerEnter(Collider other) {
	        // Because of physics layers we can only collide with the goal
	        m_netPlayer.SendCmd(new MessageScored(m_rand.Next(5, 15)));
	    }

	    private void Remove(object sender, EventArgs e) {
	        Destroy(gameObject);
	    }

	    private void OnColor(MessageColor data) {
	        m_color = CSSParse.Style.ParseCSSColor(data.color);
	        gameObject.renderer.material.color = m_color;
	    }

	    private void OnSetName(MessageSetName data) {
	        if (data.name.Length == 0) {
	            m_netPlayer.SendCmd(new MessageSetName(m_name));
	        } else {
	            m_name = data.name;
	        }
	    }

	    private void OnBusy(MessageBusy data) {
	        // not used.
	    }

		bool moveLeft = false;

		private void OnMoveLeft(MessageMoveLeft data) {
		
			if (data.down)
				moveLeft = true;
			else
				moveLeft = false;

			if (transform.localScale.x > 0)
				Flip ();
		}

		bool moveRight = false;
		
		private void OnMoveRight(MessageMoveRight data) {
			if (data.down)
				moveRight = true;
			else
				moveRight = false;

			if (transform.localScale.x < 0)
				Flip ();
		}

		bool moveDown = false;
		
		private void OnMoveDown(MessageMoveDown data) {
			if (data.down)
				moveDown = true;
			else
				moveDown = false;
		}

		bool moveUp = false;
		
		private void OnMoveUp(MessageMoveUp data) {
			if (data.down)
				moveUp = true;
			else
				moveUp = false;
		}

		bool flying = false;

		private void OnFlying(MessageFlying data)
		{
			flying = true;
			if (data.down)
				StartCoroutine(Fly());
		}

		private void OnStrength (MessageStrength data)
		{
			m_strength = data.strength;
//			Debug.Log (m_strength);
		}

		private void OnFight (MessageFight data)
		{
			data.down = true;
			// make sure size is always relative to strength variable
			gameObject.SetActive(true);
			StartCoroutine(FightSequence());

		}

		IEnumerator FightSequence ()
		{
			transform.localScale = new Vector3 (m_strength * m_initialScale, m_strength * m_initialScale);
			anim.SetBool("transferDown", true);
			yield return new WaitForSeconds(.0001f);
		}

		IEnumerator Fly()
		{
			// play the flying animation
			anim.SetBool("flying", true);
			yield return new WaitForSeconds(flyingTime);
			anim.SetBool ("flying",false);
			flying = false;

		}

		private void Flip ()
		{
			transform.localScale = new Vector3(-transform.localScale.x,transform.localScale.y,transform.localScale.z);
			transform.GetChild(0).localScale = new Vector3(-transform.GetChild(0).localScale.x,transform.GetChild(0).localScale.y,transform.GetChild(0).localScale.z);

		}

		void OnCollisionEnter2D(Collision2D coll)
		{
			if (flying)
			{
//				Debug.Log ("Die Message Sent by " + m_name);
				coll.gameObject.SendMessage("Die");
			}
		}

		void Die()
		{
			StartCoroutine(DieSequence());

		}

		IEnumerator DieSequence()
		{
//			Debug.Log ("Die Message Received by " + m_name);
			anim.SetBool("transferUp", true);
//			iTween.MoveAdd(gameObject,new Vector3(0,10,0), 2);
			yield return new WaitForSeconds(1.75f);
			m_netPlayer.SendCmd(new MessageDie());
			gameObject.SetActive(false);
//			Destroy (gameObject);
		}

	    private System.Random m_rand;
	    private NetPlayer m_netPlayer;
	    private Vector3 m_position;
	    private Color m_color;
	    public string m_name;
	    private static int s_nextPlayerId = 0;
	}

}  // namespace HappyFunTimesExample

