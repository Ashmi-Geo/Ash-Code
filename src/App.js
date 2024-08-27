import { useState, useEffect } from 'react';
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import image from "D:\\Final_Year_Project\\yolov8\\client\\src\\bg.png";
import { Store } from 'react-notifications-component';
import { Bar, Pie } from "react-chartjs-2";
// import axios from 'axios';
import { Chart } from 'chart.js/auto';


function App() {

  const [r1FireCount, setR1FireCount] = useState(1);
  const [r2FireCount, setR2FireCount] = useState(3);
  const [r3FireCount, setR3FireCount] = useState(6);

  const [r1DebrisCount, setR1DebrisCount] = useState(4);
  const [r2DebrisCount, setR2DebrisCount] = useState(9);
  const [r3DebrisCount, setR3DebrisCount] = useState(6);


  const [bird_count, setBirdCount] = useState(1);
  const [fire_count, setFireCount] = useState(3);
  const [debris_count, setDebrisCount] = useState(6);

  const [lastSeenFire, setLastSeenFire] = useState("");
  const [lastSeenDebris, setLastSeenDebris] = useState("");
  const [lastSeenBird, setLastSeenBird] = useState("");

  const [responseData, setResponseData] = useState({});

  const labels_bar = ["Runway 1", "Runway 2", "Runway 3"];
  const labels_pie = ["Fire", "Birds", "Debris"]


  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:5000/data', {
        method: 'GET'
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          setResponseData(res);
        })
    };

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);

  },[]);

  useEffect(() => {
    const handleResponse = (res) => {
      console.log(res);


      if (res.object === 'fire') {
        if (res.timestamp !== lastSeenFire) 
        {
          setLastSeenFire(res.timestamp);

          Store.addNotification({
            title: "Fire Detected at " + res.timestamp + "!",
            message: "Send fire truck.",
            type: "danger",
            insert: "top",
            container: "bottom-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              // duration: 2000,
              onScreen: true
            }
          });



          setFireCount(fire_count + 1);

          if (res.runway == 1) {
            setR1FireCount(r1FireCount + 1);
            console.log("R1:" + r1FireCount);
          }
          else if (res.runway == 2) {
            setR2FireCount(r2FireCount + 1);
          }
          else if (res.runway == 3) {
            setR3FireCount(r3FireCount + 1);
          }


        }
      }

      else if (res.object === 'debris') {

        if (res.timestamp !== lastSeenDebris) {
          setLastSeenDebris(res.timestamp);

          
          Store.addNotification({
            title: "Debris Detected at " + res.timestamp + "!",
            message: "Send surveillance team.",
            type: "info",
            insert: "top",
            container: "top-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              // duration: 5000,
              onScreen: true
            }
          });

          setDebrisCount(debris_count + 1);

          if (res.runway === 1) {
            setR1DebrisCount(r1DebrisCount + 1);
            console.log("R1:" + r1DebrisCount);
          }
          else if (res.runway === 2) {
            setR2DebrisCount(r2DebrisCount + 1);
          }
          else if (res.runway === 3) {
            setR3DebrisCount(r3DebrisCount + 1);
          }

        }
      }

      else if (res.object === 'bird') {

            if (res.timestamp!=lastSeenBird)
            {
              setLastSeenBird(res.timestamp);
              
              Store.addNotification({
                title: "Bird(s) Detected at " + res.timestamp + "!",
                message: "Alarm has been sounded.",
                type: "default",
                insert: "top",
                container: "center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
              });

              setBirdCount(bird_count + 1);
            }
      }



    };

    handleResponse(responseData);
  }, [responseData]);




  return (
    <div>
      <style>{`body { background-image: url(${image}); background-repeat: no-repeat; background-size:cover; }`}</style>
      <h1 style={{ color: "lightgrey", fontSize: "3rem" }}><center>AIRPORT SURVEILLANCE SYSTEM</center></h1>
      
      <div>
        <ReactNotifications />
      </div>

      <div style={{ position:'absolute', maxWidth: "350px", backgroundColor: "#f5f5f5", marginLeft: "60px", marginTop:"50px" }}>
        <Bar data={{
          labels: labels_bar,
          datasets: [
            {
              label: "No. of fire instances detected per runway",
              backgroundColor: ["rgb(178,216,216)", "rgb(0,128,128)", "rgb(0,76,76)"],
              borderColor: "rgb(0,0,0)",
              borderWidth: "1px",
              data: [r1FireCount, r2FireCount, r3FireCount],
            },
          ],
        }} />
      </div>


      <div style={{ position:'absolute',maxWidth: "350px", backgroundColor: "#f5f5f5", marginLeft: "60px", marginTop: "300px" }}>
        <Pie data={{
          labels: labels_pie,
          datasets: [
            {
              label: "Count of Foreign Objects",
              backgroundColor: ["rgb(178,216,216)", "rgb(0,128,128)", "rgb(0,76,76)"],
              borderColor: "rgb(0,0,0)",
              data: [fire_count, bird_count, debris_count],
            },
          ],
        }} />
      </div>

      <div style={{ position:'absolute',maxWidth: "350px", backgroundColor: "#f5f5f5", marginLeft:"1000px" , marginTop: "50px" }}>
        <Bar data={{
          labels: labels_bar,
          datasets: [
            {
              label: "No. of debris instances detected per runway",
              backgroundColor: ["rgb(178,216,216)", "rgb(0,128,128)", "rgb(0,76,76)"],
              borderColor: "rgb(0,0,0)",
              borderWidth: "1px",
              data: [r1DebrisCount, r2DebrisCount, r3DebrisCount],
            },
          ],
        }} 
        options={{
          indexAxis: 'y',

        }}
        />
      </div>

      <div style={{
        position:'absolute',
        backgroundColor: "rgb(178,216,216)",
        width: "120px",
        height: "120px",
        textAlign: "center",
        fontFamily: "sans-serif",
        fontSize: "15px",
        color: "rgb(54, 69, 79)",
        marginLeft:"1000px" , 
        marginTop: "300px"
      }}>
        Debris Count
        <div style={{padding:"35px"}}>{debris_count}</div>
      </div>

      <div style={{
        position:'absolute',
        backgroundColor: "rgb(178,216,216)",
        width: "120px",
        height: "120px",
        textAlign: "center",
        fontFamily: "sans-serif",
        fontSize: "15px",
        color: "rgb(54, 69, 79)",
        marginLeft:"1150px" , 
        marginTop: "300px"
      }}>
        Fire Count
        <div style={{padding:"35px"}}>{fire_count}</div>
      </div>

      <div style={{
        position:'absolute',
        backgroundColor: "rgb(178,216,216)",
        width: "120px",
        height: "120px",
        textAlign: "center",
        fontFamily: "sans-serif",
        fontSize: "15px",
        color: "rgb(54, 69, 79)",
        marginLeft:"1000px" , 
        marginTop: "450px"
      }}>
        Bird Count
        <div style={{padding:"35px"}}>{bird_count}</div>
      </div>

      <div style={{
        position:'absolute',
        backgroundColor: "rgb(0,76,76)",
        width: "120px",
        height: "120px",
        textAlign: "center",
        fontFamily: "sans-serif",
        fontSize: "15px",
        color: "lightgrey",
        marginLeft:"1150px" , 
        marginTop: "450px"
      }}>
        Foreign Objects Count
        <div style={{padding:"20px"}}>{bird_count + debris_count + fire_count}</div>
      </div>


      




    </div>
  );
}

export default App;