const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const mySecret = process.env["DISCORD_TOKEN"];
const admin = require("firebase-admin");
const { Timestamp } = require("firebase/firestore");
const randomStrings = require("randomstring");
require('dotenv').config();
require("firebase/firestore");


var firebase = {
  "type": process.env.TYPE,
  "project_id": process.env.PROJECT_ID,
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key":  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": process.env.AUTH_URI,
  "token_uri": process.env.TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.AUTH_PRO,
  "client_x509_cert_url": process.env.CERT_URL
}

admin.initializeApp({
  credential: admin.credential.cert(firebase),
});

const db = admin.firestore();
console.log("Database connected");

client.once("ready", () => {
  console.log("Ready!");
});


setInterval(() => {
  var today = new Date();
  var hours = today.getHours()+5;
  var minutes = today.getMinutes()+30;
  if(minutes>=60) hours+=1;
  var seconds = today.getSeconds();
  if (((hours)%24) == 17 && ((minutes)%60) == 42 && seconds == 0) { SendEvents(123456778543); }
}, 1000);


async function SendEvents(ID) {

  const userRef = db.collection("events");
  userRef.get().then((querySnap) => {
    
    var ev =0;

    querySnap.docs.forEach((doc)=>{
      const info1 = doc.data();
    var today1 = new Date();
    var todayDate= today1.getDate();
    const DateTime = info1.dateTime; 
    const timeStampFromDB = DateTime._seconds;
    const dateObj = new Date(timeStampFromDB * 1000);
    const day = dateObj.getUTCDate();
    const ShouldShow1 = info1.approved;
      if(day==(todayDate+1) && ShouldShow1==true)
      ev++;
    });
    
    if(ev>0){
    client.channels.cache
      .get(process.env.CHANNEL_ID)
      .send("Events Happening Tomorrow: " + "\n");

    querySnap.docs.forEach((doc) => {
      const info = doc.data();
      console.log(info);
      const ShouldShow = info.approved;

      if (ShouldShow === true) {
        const objName = info.name;
        const objVenue = info.venue;
        const objDesc = info.description;
        const ImageURL = info.imageUrl;
        const DateTime = info.dateTime;

        const timeStampFromDB = DateTime._seconds;
        const dateObj = new Date(timeStampFromDB * 1000);


        var hours = dateObj.getUTCHours() + 5 - 12;
        var minutes = dateObj.getUTCMinutes() + 30;
        if (minutes >= 60) {
          minutes = minutes - 60;
          hours = hours + 1;
        }
        if (minutes < 10)
          var newTime = hours + ":" + "0" + minutes + "PM";
        else
          var newTime = hours + ":" + minutes + "PM";

        const month = dateObj.getUTCMonth() + 1;
        const day = dateObj.getUTCDate();
        const year = dateObj.getUTCFullYear();
        const newdate = day + "/" + month + "/" + year;


        let Link = info.registrationLink;
        if (Link === "") Link = "To be available after registration!";

        console.log(DateTime);
        console.log(objName);
        console.log(ImageURL);

        const exampleEmbed = new Discord.MessageEmbed()
          .setColor(`RANDOM`)
          .setTitle(`${objName}`)
          .setDescription(`${objDesc}`)
          .setThumbnail(
            `${ImageURL}`
          )
          .addFields(
            { name: "Link", value: `${Link}` },
            { name: "Venue", value: `${objVenue}` },
            { name: "Date: ", value: `${newdate}`, inline: true },
            { name: "Time", value: `${newTime}`, inline: true }
          )
          .setTimestamp()
          .setFooter({
            text: "Protégé",
            iconURL:
              "https://media-exp1.licdn.com/dms/image/C4E0BAQHBnwHJpQfQkg/company-logo_200_200/0/1599215253505?e=2159024400&v=beta&t=ruqBwg-nchRN7kSurkazakIbwxBv_1mZe9Iwkp7Hfxk",
          });

        var today = new Date();
        var todayDate= today.getDate(); 
        if(day==(todayDate+1)){
        client.channels.cache
          .get(process.env.CHANNEL_ID)
          .send({ embeds: [exampleEmbed] });
        }

      }
      
    });
  }

    else if(ev==0){
      console.log("no event");
    //   const exampleEmbedNoEvent = new Discord.MessageEmbed()
    //   .setColor(`RED`)
    //   .setTitle("NO EVENT SCHEDULED FOR TOMORROW")
    //   .setThumbnail("https://media-exp1.licdn.com/dms/image/C4E0BAQHBnwHJpQfQkg/company-logo_200_200/0/1599215253505?e=2159024400&v=beta&t=ruqBwg-nchRN7kSurkazakIbwxBv_1mZe9Iwkp7Hfxk")  
    //   .setTimestamp()
    //   .setFooter({
    //     text: "Protégé",
    //     iconURL:
    //       "https://media-exp1.licdn.com/dms/image/C4E0BAQHBnwHJpQfQkg/company-logo_200_200/0/1599215253505?e=2159024400&v=beta&t=ruqBwg-nchRN7kSurkazakIbwxBv_1mZe9Iwkp7Hfxk",
    //   });
    // client.channels.cache
    // .get(process.env.CHANNEL_ID)
    // .send({ embeds: [exampleEmbedNoEvent] });
    }

  });
}

client.on("messageCreate", (message) => {


  // if(Date.getUTCHours()==1 && Date.getUTCMinutes()==20){

  // }

  if (message.content === "..") {

    
    var todaytest = new Date();
    var hourstest =(todaytest.getHours())+5;
    var minutestest = (todaytest.getMinutes())+30;
    if(minutestest>=60) {hourstest+=1;};
    message.channel.send(`${hourstest%24} : ${minutestest%60}`);
  }


  if (message.content === ".events") {
    SendEvents(123456778543);
  }
  if (message.content === ".ping") {
    message.channel.send("Ping");
  }
});

client.login(process.env.DISCORD_TOKEN);
