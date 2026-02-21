// assets/js/projects.js

const projectsData = [
    {
        id: 1,
        title: "STM32 Flight Controller",
        category: "hardware",
        image: "assets/images/project1.jpg",
        description: "High-performance drone flight controller based on STM32F4, featuring custom PCB design and PID stabilization algorithms.",
        tags: ["Altium", "C++", "RTOS"],
        links: {
            github: "#",
            demo: "#"
        }
    },
    {
        id: 2,
        title: "IoT Home Dashboard",
        category: "software",
        image: "assets/images/project2.jpg",
        description: "Real-time smart home control panel built with React and MQTT, communicating with ESP32 nodes.",
        tags: ["React", "MQTT", "ESP32"],
        links: {
            github: "#"
        }
    },
    {
        id: 3,
        title: "FPGA Signal Processor",
        category: "hardware",
        image: "assets/images/project3.jpg",
        description: "Digital Signal Processing pipeline implemented on Xilinx Artix-7 for real-time audio filtering.",
        tags: ["Verilog", "Vivado", "DSP"],
        links: {
            // demo: "#" // اگر لینک دمو نداره، این خط رو ننویسیم خودش هندل میکنه
        }
    }
    // هر وقت پروژه جدید خواستی، یه {} جدید اینجا کپی کن!
];