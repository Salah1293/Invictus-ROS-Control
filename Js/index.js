

document.addEventListener('DOMContentLoaded', function() {

    console.log('roslibjs loaded:', typeof ROSLIB !== 'undefined'); 
    const ros = new ROSLIB.Ros({
        url: 'ws://192.168.1.213:9090'
    });

    ros.on('connection', function() {
        console.log('Connected to websocket server.');
    });

    ros.on('error', function(error) {
        console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function() {
        console.log('Connection to websocket server closed.');
    });

      ///////////////////////Subscribe to the /visualized_detections topic to receive image frames/////////////////////////////////

      const visualizedDetectionsTopic = new ROSLIB.Topic({
        ros: ros,
        name: '/visualized_detections', // This is the topic that publishes image data
        messageType: 'sensor_msgs/Image'
    });

    visualizedDetectionsTopic.subscribe(function (message) {
        // const { data, width, height } = message;
        const { data } = message;
        
         // Convert the image data to a base64 string for display in <img> tag
    const base64Image = `data:image/jpeg;base64,${data}`;

    // Display the image in the HTML
    const imageElement = document.getElementById('robot-image');
    imageElement.src = base64Image;

    // console.log(`Received image with width: ${width}, height: ${height}`);
    console.log(`Received and displayed image from /visualized_detections topic.`);
});



/////////////////////// Subscribe to the /mavros/local_position/odom topic////////////////////////////////
const odomTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/mavros/local_position/odom',
    messageType: 'nav_msgs/Odometry'
});

// Handle incoming odometry messages
odomTopic.subscribe(function(message) {
    console.log('Received odometry message:', message);

    // Extract position and orientation
    const position = message.pose.pose.position;
    const orientation = message.pose.pose.orientation;

    const linearVelocity = message.twist.twist.linear;
    const angularVelocity = message.twist.twist.angular;

    document.getElementById('position-x').innerText = `x: ${position.x.toFixed(2)}`;
    document.getElementById('position-y').innerText = `y: ${position.y.toFixed(2)}`;
    document.getElementById('orientation').innerText = `Orientation: ${orientation.z.toFixed(2)}`; 

    document.querySelector('.velocity-info p:nth-of-type(1)').innerText = 
            `Linear Velocity: (x: ${linearVelocity.x.toFixed(2)}, y: ${linearVelocity.y.toFixed(2)}, z: ${linearVelocity.z.toFixed(2)})`;
    document.querySelector('.velocity-info p:nth-of-type(2)').innerText = 
            `Angular Velocity: (x: ${angularVelocity.x.toFixed(2)}, y: ${angularVelocity.y.toFixed(2)}, z: ${angularVelocity.z.toFixed(2)})`;
});

    //////////////////////////////////////////////////////////////////////////////////////////

    // Set up the map with Leaflet
    // const map = L.map('robot-map').setView([51.505, -0.09], 13); // Center the map

    // Add OpenStreetMap tiles to the map
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    // }).addTo(map);

    // Create a marker to represent the robot
    // let robotMarker = L.marker([51.505, -0.09]).addTo(map);

    //////////////////////////////////// Subscribe to a ROS topic that provides the robot's position/////////////////////////////////////
    // const robotPositionTopic = new ROSLIB.Topic({
    //     ros: ros,
    //     name: '/robot/position',
    //     messageType: 'geometry_msgs/Pose'
    // });

    // // Listen for position updates from ROS and move the marker on the map
    // robotPositionTopic.subscribe(function (message) {
    //     const { position } = message; // Extract position data from the ROS message
    //     const lat = position.y; // Assuming the y-coordinate is latitude
    //     const lon = position.x; // Assuming the x-coordinate is longitude
    //     const orientationValue = orientationValue.z;

    //     // Update the robot marker position on the map
    //     robotMarker.setLatLng([lat, lon]);

    //     // Optionally, re-center the map as the robot moves
    //     map.setView([lat, lon], 13);

    //     document.querySelector('.position-info p:nth-child(2)').textContent = `x: ${lon.toFixed(2)}`; // Update x-coordinate
    //     document.querySelector('.position-info p:nth-child(3)').textContent = `y: ${lat.toFixed(2)}`; // Update y-coordinate
    //     document.querySelector('.position-info p:nth-child(4)').textContent = `Orientation: ${orientationValue.toFixed(2)}`; // Update orientation
    // });

  

    // // Robot status toggle
    // let robotOn = false;
    // const statusButton = document.getElementById('status-button');
    // statusButton.addEventListener('click', function() {
    //     robotOn = !robotOn;
    //     if (robotOn) {
    //         statusButton.classList.remove('btn-success');
    //         statusButton.classList.add('btn-danger');
    //         statusButton.textContent = 'Robot OFF';
    //         // Add your ROS logic for turning the robot off
    //     } else {
    //         statusButton.classList.remove('btn-danger');
    //         statusButton.classList.add('btn-success');
    //         statusButton.textContent = 'Robot ON';
    //         // Add your ROS logic for turning the robot on
    //     }
    // });

    // // Handling arrow button clicks
    // document.getElementById("up").addEventListener("click", () => moveRobot(1, 0));    // Move forward
    // document.getElementById("down").addEventListener("click", () => moveRobot(-1, 0)); // Move backward
    // document.getElementById("left").addEventListener("click", () => moveRobot(0, 1));  // Turn left
    // document.getElementById("right").addEventListener("click", () => moveRobot(0, -1)); // Turn right

    // // Function to publish movement commands to ROS
    // function moveRobot(linearX, angularZ) {
    //     const cmdVel = new ROSLIB.Topic({
    //         ros: ros,
    //         name: '/cmd_vel', // ROS topic name
    //         messageType: 'geometry_msgs/Twist'
    //     });

    //     const twist = new ROSLIB.Message({
    //         linear: {
    //             x: linearX,
    //             y: 0,
    //             z: 0
    //         },
    //         angular: {
    //             x: 0,
    //             y: 0,
    //             z: angularZ
    //         }
    //     });

    //     cmdVel.publish(twist);

    //     // Animate the control circle
    //     const innerCircle = document.getElementById('inner-circle');
    //     innerCircle.classList.remove('active-up', 'active-down', 'active-left', 'active-right');

    //     if (linearX > 0) {
    //         innerCircle.classList.add('active-up');
    //     } else if (linearX < 0) {
    //         innerCircle.classList.add('active-down');
    //     }

    //     if (angularZ > 0) {
    //         innerCircle.classList.add('active-left');
    //     } else if (angularZ < 0) {
    //         innerCircle.classList.add('active-right');
    //     }

    //     // Reset the animation after 300ms
    //     setTimeout(() => {
    //         innerCircle.classList.remove('active-up', 'active-down', 'active-left', 'active-right');
    //     }, 300);
    // }
});
