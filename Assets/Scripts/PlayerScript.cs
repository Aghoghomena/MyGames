using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerScript : MonoBehaviour
{
    public float speed = 10.0f;
    public float xRange = 10.0f;
    private float espees = 0.0f;
    private Rigidbody rb;
    private bool jump = false;
    // Start is called before the first frame update
    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }

    // Update is called once per frame
    void Update()
    {
        // transform.Translate(Vector3.forward * Time.deltaTime * speed);
        float horizontalInput = Input.GetAxis("Horizontal");
        transform.Translate(Vector3.right * horizontalInput * Time.deltaTime * speed);

        //left and right boundries
        if (transform.position.x < -xRange)
        {
            transform.position = new Vector3(-xRange, transform.position.y, transform.position.z);
        }
        else if (transform.position.x > xRange)
        {
            transform.position = new Vector3(xRange, transform.position.y, transform.position.z);
        }

        if (Input.GetKeyDown(KeyCode.Space) && !jump)
        {
            rb.AddForce(new Vector3(0, 400, 0));
            jump = true;
        }

    }

    private void OnCollisionEnter(Collision other)
    {
        Debug.Log(other.gameObject.tag);
        Debug.Log(other.gameObject.name);
        if (other.gameObject.CompareTag("Espee"))
        {
            // explosionParticle.Play();
            // playerAudio.PlayOneShot(crashSound, 1.0f);
            // gameOver = true;
            // Debug.Log("You did not survive. Game Over");
            espees += 100;
            Destroy(other.gameObject);
        }
        else if (other.gameObject.CompareTag("Obstacle"))
        {
            // fireworkParticle.Play();
            // playerAudio.PlayOneShot(eatSound, 1.0f);
            // Debug.Log("Player has collided with powerup");
            // Destroy(other.gameObject);
            espees -= 50;
        }
        jump = false;
    }

    private void OnGUI()
    {
        GUI.color = Color.blue;
        GUI.Label(new Rect(5, 5, 250, 200), "" + ((int)espees) + " Espees");
    }

}
