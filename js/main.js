import { createApp, toRaw } from "vue";
import { YYYYMMDD } from "./date.js";
import { useSchedule } from "./schedule.js";
import { MyStorage } from "./storage.js";

const today = YYYYMMDD(new Date());

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
        this.stop();
        MyStorage.save(toRaw(this.schedule));
      } else {
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
