import BaseLayout, { type BaseLayoutProps } from "../components/baselayout"
import { Html } from "@elysiajs/html"
import { SarpLeafIcon } from "./resources/resources"

export default function Home({ children, userCredentials }: BaseLayoutProps) {

  return (
    <BaseLayout title="Home" {...{ userCredentials }}>
      <div class="flex flex-col justify-center items-left gap-y-2 p-12 text-justify  md:w-auto">
        <h1 class="text-left">Bienvenido a SARP!</h1>
        <SarpLeafIcon classes="self-center min-w-96 max-w-96 drop-shadow-xl" />
        <div class="text-left space-y-6">
          <h2 class="text-2xl font-semibold">¿Qué es SARP?</h2>
          <hr class="my-2 border-green-700" />
          <p>
            SARP es un sistema de riego inteligente, escalable y de bajo coste, diseñado para usuarios sin conocimientos técnicos.
            El motivo principal de este proyecto es no sólo automatizar y monitorizar tareas de jardinería y el estado de las plantas, sino también investigar una reducción de coste para un sistema similar,
            montando una arquitectura fácil de escalar y que aporte funcionalidad y usabilidad.
            Esta guía explica paso a paso cómo montar, configurar y conectar los módulos del sistema.
          </p>
          <h2 class="text-2xl font-semibold">¿Qué requisitos son necesarios para utilizarlo?</h2>
          <hr class="my-2 border-green-700" />
          <p>
            Los componentes principales del sistema SARP son:
          </p>
          <ul class="list-disc list-inside pl-6 space-y-1">
            <li>
              <b>Sensores y actuadores</b>: humedad del suelo, temperatura ambiental y relés para controlar válvulas de riego.
            </li>
            <li>
              <b>La aplicación móvil (SARPApp)</b>: para configurar los módulos vía BLE.
            </li>
            <li>
              <b>Esta página web</b>: para visualizar datos y gestionar el sistema desde la comodidad de tu móvil, ordenador u otro dispositivo que soporte web.
            </li>
          </ul>
          <h2 class="text-2xl font-semibold">Cómo usar esta Web App</h2>
          <hr class="my-2 border-green-700" />
          <p>
            Para poder usar esta app, primero debes hacerte con un microcontrolador que soporte tecnología BLE y WiFi,
            (a parte de tener pines suficientes para los periféricos).
            Recomiendo usar una{" "}
            <a
              class="text-green-600 underline hover:text-green-800 transition-colors"
              href="https://www.amazon.es/Tablero-Desarrollo-ESP-WROOM-32-ESP-32S-Bluetooth/dp/B071JR9WS9?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2YO1VFMBKU2M2&dib=eyJ2IjoiMSJ9.ZueMOvD44MutNc7kUyivWY0LozYbZjLimwJBK9Kp8ntpmcuHLWWca2SDQa7o23XKobBXZ-n2wEQP-dMiapHgTK0XiR8Zg7bY-SSDdRgKByuC57T6hDs2UobMwv4kbw3AburzKbCIAMDFK41_MxbEYqdLBcjkWEaStxjippmEZpONhWk8jUIinCVULKvpapH8jj8UBBR7RC-N6Ia-VcSmZJhMza7mKR3IzXYJ6bIevsR_8Z_nl1kQD7NQU0I7Vlcx4Lv-gpzSWDZfTtlsDnXE6_YegxD09s30Clmq7pmouwg.1V-_4D7zGg0ZV0iq_1_pVd8UdCQHhiC_wlsnCLNaR5w&dib_tag=se&keywords=esp32&qid=1747170646&sprefix=esp32%2Caps%2C152&sr=8-20"
              target="_blank"
              rel="noopener noreferrer"
            >
              ESP32
            </a>
            , pues es el microcontrolador que he usado como modelo para realizar esta web app.
          </p>
          <p>
            Una vez tengas el microcontrolador, debes conectar los sensores y actuadores a los pines adecuados,
            y montar el circuito según las indicaciones de la sección{" "}
            <a class="text-green-600 underline hover:text-green-800 transition-colors" href="#MontajeFisico">
              Montaje físico
            </a>
            .
          </p>
          <p>
            <b>
              <i>IMPORTANTE: </i> El microcontrolador debe tener el firmware de SARP cargado previamente. Para ello, descarga el código fuente desde este{" "}
              <a
                class="text-green-600 underline hover:text-green-800 transition-colors"
                href="https://github.com/MakoreAkaRaku/SARP_ESP32_Module">
                repositorio
              </a>
              {" "}y flashea el firmware usando el IDE de ESP-IDF, Arduino o PlatformIO.
            </b>
          </p>
          <p>Después, descarga la aplicación móvil {" "}
            <a
              class="text-green-600 underline hover:text-green-800 transition-colors"
              href="https://github.com/MakoreAkaRaku/SARP_Bluetooth_App/releases">
              SARPApp
            </a>
            {" "} desde la tienda de aplicaciones de tu dispositivo móvil.
            Inicia sesión con las credenciales que usaste para registrarte en esta web, y sigue las instrucciones para configurar el microcontrolador vía BLE.
            Finalmente, una vez configurado el microcontrolador, este se conectará automáticamente a la red Wi-Fi y comenzará a enviar datos a la API REST.
          </p>
          <p>
            Desde la interfaz web, podrás visualizar los datos en tiempo real e históricos, activar o desactivar el riego manualmente, planificar horarios de riego automático, y gestionar los módulos, grupos y tokens.
          </p>
          <h2 id="MontajeFisico" class="text-2xl font-semibold">Montaje físico</h2>
          <hr class="my-2 border-green-700" />
          <p>
            Esta sección detalla cómo montar y configurar el sistema SARP desde cero.
          </p>
          <ol class="list-decimal pl-6 space-y-2">
            <li>
              <b>Conecta los sensores</b> a los pines ADC del ESP32:
              <ul class="list-disc list-inside pl-6 mt-2 space-y-1">
                <li>
                  <span class="font-semibold">GPIO35</span>: Sensor de humedad del suelo.
                </li>
                <li>
                  <span class="font-semibold">GPIO34</span>: Sensor de temperatura.
                </li>
                <li>
                  <span class="font-semibold">GPIO23</span>: Control de la válvula o activadores (utiliza un relé para soportar mayor voltaje).
                </li>
              </ul>
            </li>
            <li>
              <b>Alimenta el microcontrolador</b> con una fuente de 5V.
            </li>
            <li>
              <b>Verifica el LED</b> integrado para comprobar el estado del dispositivo (véase la <a class="text-green-600 underline hover:text-green-800 transition-colors" href="#TablaLed">tabla</a>).
            </li>
          </ol>
          <h2 class="text-2xl font-semibold">Configuración inicial</h2>
          <hr class="my-2 border-green-700" />
          <p>
            Esta sección explica cómo configurar el microcontrolador ESP32 usando la aplicación móvil SARPApp. Para ello es necesario <b>estar registrado</b> en la web.
          </p>
          <ol class="list-decimal pl-6 space-y-2">
            <li>
              Descarga la aplicación móvil SARPApp desde el repositorio de{" "}
              <a
                class="text-green-600 underline hover:text-green-800 transition-colors"
                href="https://github.com/MakoreAkaRaku/SARP_Bluetooth_App/releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </li>
            <li>
              Abre la App desde el móvil, tu primera pantalla será un formulario de iniciar sesión.
            </li>
            <li>
              Inicia sesión con las credenciales usadas en esta web.
            </li>
            <li>
              Una vez dentro, verás una pantalla con tus tokens creados. Si no tienes, crea uno nuevo desde la web.
            </li>
            <li>
              Selecciona un token de registro, acto seguido, envíalo. Cualquier módulo que esté alrededor recibirá tu token.
            </li>
            <li>
              Desliza el dedo hacia la derecha, encontrarás el apartado para enviar las credenciales del WiFi.
            </li>
            <li>
              Introduce las credenciales Wi-Fi y envíalo. Cualquier módulo que esté alrededor recibirá esa configuración.
            </li>
          </ol>
          <p>
            ¡Y listo! El microcontrolador se encargará de conectarse a la red Wi-Fi y configurará el resto.
            Desde la web, podrás visualizar los datos en tiempo real e históricos, planificar horarios de riego automático, y gestionar los módulos, grupos y tokens.
          </p>
          <h2 class="text-2xl font-semibold">Tabla de LED</h2>
          <hr class="my-2 border-green-700" />
          <p>
            El LED integrado en el ESP32 indica el estado del en cuanto a conexión y configuración:
          </p>
          <table
            id="TablaLed"
            class="w-full border border-gray-700 rounded-lg overflow-hidden shadow-lg bg-gray-900"
          >
            <thead>
              <tr class="bg-gray-800">
                <th class="border-b border-gray-700 px-4 py-2 text-left text-gray-200 font-semibold">Estado</th>
                <th class="border-b border-gray-700 px-4 py-2 text-left text-gray-200 font-semibold">Nº parpadeos</th>
                <th class="border-b border-gray-700 px-4 py-2 text-left text-gray-200 font-semibold">Intervalo parpadeo (ms)</th>
                <th class="border-b border-gray-700 px-4 py-2 text-left text-gray-200 font-semibold">Nº repeticiones</th>
                <th class="border-b border-gray-700 px-4 py-2 text-left text-gray-200 font-semibold">Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-800 transition-colors">
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">SWITCH MODE</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">2</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">80</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">1</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">Cambio de modo de funcionamiento</td>
              </tr>
              <tr class="hover:bg-gray-800 transition-colors">
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">BLE CONFIG SETTED</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">1</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">1000</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">1</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">Configuración BLE establecida correctamente</td>
              </tr>
              <tr class="hover:bg-gray-800 transition-colors">
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">BLE SCANNING</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">2</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">10</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">2</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">Escaneando dispositivos BLE</td>
              </tr>
              <tr class="hover:bg-gray-800 transition-colors">
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">WIFI CONNECTING</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">3</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">25</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">1</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">Intentando conectar a Wi-Fi</td>
              </tr>
              <tr class="hover:bg-gray-800 transition-colors">
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">WIFI CONNECTED</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">4</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">250</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">1</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">Conectado a Wi-Fi correctamente</td>
              </tr>
              <tr class="hover:bg-gray-800 transition-colors">
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">ERROR</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">5</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">500</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">1</td>
                <td class="border-b border-gray-700 px-4 py-2 text-gray-100">Error detectado en el sistema</td>
              </tr>
            </tbody>
          </table>
          <h2 class="text-2xl font-semibold">Recomendaciones</h2>
          <hr class="my-2 border-green-700" />
          <ul class="list-disc list-inside pl-6 space-y-2">
            <li>Evita exponer el microcontrolador a humedad directa.</li>
            <li>Observa el LED para detectar errores de conexión.</li>
            <li>Consulta la documentación web para actualizaciones.</li>
            <li>Realiza mantenimientos periódicos del sistema.</li>
          </ul>
        </div>
      </div>
    </BaseLayout >)
}