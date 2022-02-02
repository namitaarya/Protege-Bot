const Discord = require("discord.js");
const client = new Discord.Client(
  { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] },
  { partials: ["MESSAGE", "CHANNEL", "REACTION"] }
);
const mySecret = process.env["DISCORD_TOKEN"];
const admin = require("firebase-admin");
const { Timestamp, connectFirestoreEmulator } = require("firebase/firestore");
const randomStrings = require("randomstring");
require("dotenv").config();
require("firebase/firestore");

var firebase = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PRO,
  client_x509_cert_url: process.env.CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(firebase),
});

const db = admin.firestore();
console.log("Database connected");

client.once("ready", () => {
  console.log("Ready!");
  //client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.VERIFICATION_CHANNEL_ID).fetch();
  console.log("Ready 2!");
  const BotRole = new Discord.MessageEmbed()
    .setColor(`GREEN`)
    .setTitle("Take your role")
    .setDescription(
      "Take the role according to your branches to access the respective channels."
    )
    .addFields(
      { name: "CSE, IT and CSE-AI", value: "💻"},
      { name: "MAE and DMAM", value: "🦾" },
      { name: "ECE and ECE-AI", value: "💡" },
    )
    .setTimestamp()
    .setFooter({
      text: "Protégé",
      iconURL:
        "https://media-exp1.licdn.com/dms/image/C4E0BAQHBnwHJpQfQkg/company-logo_200_200/0/1599215253505?e=2159024400&v=beta&t=ruqBwg-nchRN7kSurkazakIbwxBv_1mZe9Iwkp7Hfxk",
    });
  client.channels.cache.get(process.env.BRACH_CHANNEL).send({ embeds: [BotRole] });
});

setInterval(() => {
  var today = new Date();
  var hours = today.getHours() + 5;
  var minutes = today.getMinutes() + 30;
  if (minutes >= 60) hours += 1;
  var seconds = today.getSeconds();
  if (hours % 24 == 20 && minutes % 60 == 0 && seconds == 0) {
    SendEvents(123456778543);
  }
}, 1000);

async function SendEvents(ID) {
  const userRef = db.collection("events");
  userRef.get().then((querySnap) => {
    var ev = 0;

    querySnap.docs.forEach((doc) => {
      const info1 = doc.data();
      var today1 = new Date();
      var todayDate = today1.getDate();
      const DateTime = info1.dateTime;
      const timeStampFromDB = DateTime._seconds;
      const dateObj = new Date(timeStampFromDB * 1000);
      const day = dateObj.getUTCDate();
      const ShouldShow1 = info1.approved;
      if (day == todayDate + 1 && ShouldShow1 == true) ev++;
    });

    if (ev > 0) {
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
          if (minutes < 10) var newTime = hours + ":" + "0" + minutes + "PM";
          else var newTime = hours + ":" + minutes + "PM";

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
            .setThumbnail(`${ImageURL}`)
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
          var todayDate = today.getDate();
          if (day == todayDate + 1) {
            client.channels.cache
              .get(process.env.CHANNEL_ID)
              .send({ embeds: [exampleEmbed] });
          }
        }
      });
    } else if (ev == 0) {
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

client.on("messageCreate", (message, reaction) => {
  if (message.content === "..") {
    var todaytest = new Date();
    var hourstest = todaytest.getHours() + 5;
    var minutestest = todaytest.getMinutes() + 30;
    if (minutestest >= 60) {
      hourstest += 1;
    }
    message.channel.send(`${hourstest % 24} : ${minutestest % 60}`);
  }

  if (
    message.content === ".events" &&
    (message.author.id === process.env.NAMITA_ID ||
      message.author.id === process.env.SAMIKSHA_ID)
  ) {
    SendEvents(123456778543);
  }

  if (
    message.content === ".ping" &&
    (message.author.id === process.env.NAMITA_ID ||
      message.author.id === process.env.SAMIKSHA_ID)
  ) {
    message.channel.send("Ping");
  }

  const channelcheck = process.env.VERIFICATION_CHANNEL_ID;
  if (message.channel.id == channelcheck) {
    message.react("🧑‍🏫");
    console.log("reaction sent");
    message.react("🧑‍🎓");
  }

  if (message.channel.id == process.env.BRACH_CHANNEL) {
    message.react("💻");
    message.react("🦾");
    message.react("💡");
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  console.log("reading reactions");
  let message = reaction.message,
    emoji = reaction.emoji;

  if (
    emoji.name == "🧑‍🏫" &&
    (user.id === process.env.NAMITA_ID || user.id === process.env.SAMIKSHA_ID)
  ) {
    message.guild.members.fetch(message.author.id).then((member) => {
      member.roles.add("931587399086145646");
      message.react("✅");
      console.log(`${user.id}`);
      console.log(`${message.author.id}`);
    });
  } else if (
    emoji.name == "🧑‍🎓" &&
    (user.id === process.env.SAMIKSHA_ID || user.id === process.env.NAMITA_ID)
  ) {
    message.guild.members.fetch(message.author.id).then((member) => {
      member.roles.add("931588311712141402");
      message.react("✅");
      console.log(`${user.id}`);
      console.log(`${message.author.id}`);
    });
  }
  //computer science add role
  else if (emoji.name == "💻") {
    message.guild.members.fetch(user.id).then((member) => {
      member.roles.add("931592731258675210");
      console.log(`${user.id}`);
    });
  }
  //mechanical add role
  else if (emoji.name == "🦾") {
    message.guild.members.fetch(user.id).then((member) => {
      member.roles.add("938364053724725258");
      console.log(`${user.id}`);
    });
  }

  //ece add role
  else if (emoji.name == "💡") {
    message.guild.members.fetch(user.id).then((member) => {
      member.roles.add("938364129129922610");
      console.log(`${user.id}`);
    });
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  console.log("gonna remove a reaction");
  let message = reaction.message,
    emoji = reaction.emoji;

  if (
    emoji.name == "🧑‍🏫" &&
    (user.id === process.env.NAMITA_ID || user.id === process.env.SAMIKSHA_ID)
  ) {
    message.guild.members.fetch(message.author.id).then((member) => {
      member.roles.remove("931587399086145646");

      console.log(`${user.id}`);
      console.log(`${message.author.id}`);
    });
  } else if (
    emoji.name == "🧑‍🎓" &&
    (user.id === process.env.SAMIKSHA_ID || user.id === process.env.NAMITA_ID)
  ) {
    message.guild.members.fetch(message.author.id).then((member) => {
      member.roles.remove("931588311712141402");
      console.log(`${user.id}`);
      console.log(`${message.author.id}`);
    });
  }

  //remove cs role
  else if (emoji.name == "💻") {
    message.guild.members.fetch(user.id).then((member) => {
      member.roles.remove("931592731258675210");
      console.log(`${user.id}`);
    });
  }

  ///mechanical remove role
  else if (emoji.name == "🦾") {
    message.guild.members.fetch(user.id).then((member) => {
      member.roles.remove("938364053724725258");
      console.log(`${user.id}`);
    });
  }

  //ece remove role
  else if (emoji.name == "💡") {
    message.guild.members.fetch(user.id).then((member) => {
      member.roles.remove("938364129129922610");
      console.log(`${user.id}`);
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
