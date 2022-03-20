using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlatformTile : MonoBehaviour
{
    public Transform startPoint;
    public Transform endPoint;
    public GameObject[] obstacles; //Objects that contains different obstacle types which will be randomly activated
    public GameObject espee;
    public float spawnRangeX = 5;
    public float spawnRangeZ = 5;

    public void ActivateRandomObstacle()
    {
        DeactivateAllObstacles();

        System.Random random = new System.Random();
        int randomNumber = random.Next(0, obstacles.Length);
        CreateEspee();
        if (obstacles.Length > 0) 
        {
            obstacles[randomNumber].SetActive(true);
        }
    }

    public void DeactivateAllObstacles()
    {
        HideEspee();
        for (int i = 0; i < obstacles.Length; i++)
        {
            obstacles[i].SetActive(false);
        }
    }

    public void CreateEspee() 
    {
        espee.transform.position = new Vector3(Random.Range(-spawnRangeX, spawnRangeX), 0.5f, Random.Range(-spawnRangeZ, spawnRangeZ)); ;
        espee.SetActive(true);
    }

    public void HideEspee() 
    {
        espee.SetActive(false);
    }

}
