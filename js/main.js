import { createApp, toRaw } from "vue";
import { YYYYMMDD } from "./date.js";
import { useSchedule } from "./schedule.js";
import { MyStorage } from "./storage.js";

const today = YYYYMMDD(new Date());
const favicons = useFavicon();

function useFavicon() {
  const mainFavicons = [/* "2311057.png", */ "2311254.png"];

  const activeFavicons = [
    "2311057_red.png",
    "2311254_red.png",
    // "2496923.png",
    "red.png",
  ];

  const mainFavicon = chooseRandom(mainFavicons);
  changeFavicon(mainFavicon);
  console.log("mainFavicon", mainFavicon);

  let isActive = false;

  function toggleActiveFavicon() {
    isActive = !isActive;
    const newFavicon = isActive ? chooseRandom(activeFavicons) : mainFavicon;
    changeFavicon(newFavicon);
    console.log("newFavicon", newFavicon);
  }

  function changeFavicon(fileName) {
    /** @type {HTMLLinkElement} */
    const favicon = document.querySelector("link[rel~='icon']");
    favicon.href = `./img/${fileName}`;
  }

  function chooseRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  return { toggleActiveFavicon };
}

createApp({
  setup() {
    const { schedule, isActive, activeDuration, start, stop } = useSchedule(
      today,
      MyStorage.load()
    );
    return { schedule, isActive, activeDuration, start, stop };
  },
  data() {
    return {};
  },
  computed: {
    title() {
      const prefix = this.isActive ? `${this.activeDuration}m • ` : "";
      return `${prefix}pongo timeline`;
    },
  },
  watch: {
    title(newTitle) {
      document.title = newTitle;
    },
  },
  methods: {
    toggle() {
      if (this.isActive) {
        favicons.toggleActiveFavicon();
        this.stop();
        MyStorage.save(toRaw(this.schedule));
      } else {
        favicons.toggleActiveFavicon();
        this.start();
      }
    },
    formatBlockTitle({ duration, startHour, startMinute }) {
      const hh = startHour.toString().padStart(2, "0");
      const mm = startMinute.toString().padStart(2, "0");
      return `${duration}m, ${hh}:${mm}`;
    },
  },
  mounted() {
    window.addEventListener("keyup", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        return void this.toggle();
      }
    });
  },
}).mount("#app");
