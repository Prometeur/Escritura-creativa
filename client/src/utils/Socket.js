import io from "socket.io-client";

let socket = io("http://localhost:3001");
// const io  = require ( "socket.io-client" ); 
// const socket = io ( "//localhost:3001" , { 
//   withCredentials: true , 
//   extraHeaders: { "my-custom-header" : "abcd"   } });

export default socket;

