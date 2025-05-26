import { Html } from "@elysiajs/html"
import BaseLayout, { type BaseLayoutProps } from "../components/baselayout"
import { SarpLeafIcon } from "./resources/resources"

export default function AboutUs({ navChildren }: BaseLayoutProps) {

  return (
    <BaseLayout title="Sobre SARP" {...{ navChildren }}>
      <div class="flex flex-col justify-center items-left gap-y-2 p-12 text-justify  md:w-auto">
        <h1 class="text-left">Bienvenido a SARP!</h1>
        <SarpLeafIcon classes="self-center min-w-96 max-w-96 drop-shadow-xl" />
        <p class="justify-text-left">
          SARP es un sistema inteligente diseñado para automatizar y personalizar el riego de jardines,
          huertos o zonas verdes. Se basa en usar microcontroladores (véase ESP32) para recopilar datos y
          accionar periféricos desde la comodidad de un dispositivo con conexión a internet
          (ordenador, tablet, móvil, ...) gracias a la comunicación entre módulo y Web App.
        </p>
        <p>
          El motivo principal de este proyecto es no sólo automatizar y monitorizar tareas de jardineria y
          el estado de las plantas, sinó también investigar una reducción de coste para un sistema similar,
          montando una arquitectura fácil de escalar y que aporte funcionalidad y usabilidad
        </p>
        <h2>Cómo usar esta Web App</h2>
        <p>
          Para poder usar esta app, primero debes hacerte con un microcontrolador que soporte tecnología BLE y WiFi,
          (a parte de tener pines suficientes para los periféricos).
        </p>
        <p>Recomiendo usar una <a class="text-green-500 hover:text-white hover:" href="https://www.amazon.es/Tablero-Desarrollo-ESP-WROOM-32-ESP-32S-Bluetooth/dp/B071JR9WS9?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2YO1VFMBKU2M2&dib=eyJ2IjoiMSJ9.ZueMOvD44MutNc7kUyivWY0LozYbZjLimwJBK9Kp8ntpmcuHLWWca2SDQa7o23XKobBXZ-n2wEQP-dMiapHgTK0XiR8Zg7bY-SSDdRgKByuC57T6hDs2UobMwv4kbw3AburzKbCIAMDFK41_MxbEYqdLBcjkWEaStxjippmEZpONhWk8jUIinCVULKvpapH8jj8UBBR7RC-N6Ia-VcSmZJhMza7mKR3IzXYJ6bIevsR_8Z_nl1kQD7NQU0I7Vlcx4Lv-gpzSWDZfTtlsDnXE6_YegxD09s30Clmq7pmouwg.1V-_4D7zGg0ZV0iq_1_pVd8UdCQHhiC_wlsnCLNaR5w&dib_tag=se&keywords=esp32&qid=1747170646&sprefix=esp32%2Caps%2C152&sr=8-20">ESP32</a>, pues es el microcontrolador que me he usado como modelo para realizar esta web app.</p>
      </div>

      <h1>ESTO NO ESTA ACABADO; seguir redactando</h1>

    </BaseLayout>
  )
}