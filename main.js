import { createApp, toRaw } from "vue";
import { YYYYMMDD } from "./core.js";
import { useSchedule } from "./schedule.js";
import { MyStorage } from "./storage.js";

const today = YYYYMMDD(new Date());

createApp({
  setup() {
    const { schedule, isActive, activeDuration, start, stop } = useSchedule(
      today,
      MyStorage.load()
      // // load()
      // // [
      // //   ["2024-12-01", 18, 14, 60],
      // //   [today, 10, 0, 25],
      // //   [today, 10, 30, 25],
      // // ]
      // [
      //   {
      //     date: today,
      //     blocks: [
      //       { active: false, duration: 25, startHour: 10, startMinute: 0 },
      //       { active: false, duration: 25, startHour: 10, startMinute: 30 },
      //     ],
      //   },
      //   {
      //     date: "2024-12-01",
      //     blocks: [
      //       { active: false, duration: 60, startHour: 18, startMinute: 14 },
      //     ],
      //   },
      // ]
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
  },
  mounted() {
    window.addEventListener("keyup", (event) => {
      if (event.code === "Space") {
        return void this.toggle();
      }
    });
  },
}).mount("#app");
