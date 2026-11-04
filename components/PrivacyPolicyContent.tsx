export default function PrivacyPolicyContent() {
  return (
    <div className="text-sm text-gray-700 space-y-6">
      <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
        <table className="w-full">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="font-semibold bg-gray-50 p-2 w-1/3">Version</td>
              <td className="p-2">1.0</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="font-semibold bg-gray-50 p-2">Fecha de emision</td>
              <td className="p-2">31 de agosto de 2026</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="font-semibold bg-gray-50 p-2">Responsable</td>
              <td className="p-2">[RAZON SOCIAL / TITULAR DE MENTORMIND]</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="font-semibold bg-gray-50 p-2">RUC</td>
              <td className="p-2">[RUC]</td>
            </tr>
            <tr>
              <td className="font-semibold bg-gray-50 p-2">
                Contacto de privacidad
              </td>
              <td className="p-2">[CORREO DE PRIVACIDAD]</td>
            </tr>
          </tbody>
        </table>
      </div>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">1. Objeto y alcance</h3>
        <p className="mb-2">
          La presente Politica de Privacidad describe como MentorMind
          recopila, utiliza, almacena, comparte y protege los datos
          personales de las personas que acceden o utilizan su plataforma,
          sitio web, aplicaciones, modulos de aprendizaje, funcionalidades de
          seguimiento academico, analitica, evaluaciones y demas servicios
          asociados.
        </p>
        <p>
          Esta Politica aplica a usuarios finales, estudiantes,
          colaboradores, supervisores, formadores, administradores, clientes
          corporativos y demas personas cuyos datos personales sean tratados
          a traves de MentorMind, segun corresponda al servicio contratado y
          al rol que desempenen.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          2. Identidad del responsable del tratamiento
        </h3>
        <p className="mb-2">
          El responsable del tratamiento de los datos personales es [RAZON
          SOCIAL / TITULAR DE MENTORMIND], identificado con RUC [RUC], con
          domicilio en [DOMICILIO], en adelante, "MentorMind".
        </p>
        <p className="mb-2">
          Para consultas relacionadas con privacidad y proteccion de datos
          personales, los titulares pueden comunicarse al correo [CORREO DE
          PRIVACIDAD] o mediante [CANAL ADICIONAL, SI APLICA].
        </p>
        <p>
          Cuando MentorMind opere por encargo de una empresa cliente y trate
          datos siguiendo instrucciones de dicha organizacion, MentorMind
          podra actuar como encargado del tratamiento y la empresa cliente
          sera responsable de determinar las finalidades y medios del
          tratamiento, de acuerdo con la normativa aplicable.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">3. Marco normativo</h3>
        <p className="mb-2">
          Esta Politica se interpreta de conformidad con la Ley N.º 29733,
          Ley de Proteccion de Datos Personales del Peru, y su Reglamento
          aprobado por Decreto Supremo N.º 016-2024-JUS, asi como con las
          demas normas, directivas y criterios emitidos por la Autoridad
          Nacional de Proteccion de Datos Personales que resulten aplicables.
        </p>
        <p>
          Si el servicio es utilizado en otras jurisdicciones, podran
          resultar aplicables obligaciones adicionales, las cuales deberan
          ser evaluadas segun el pais, tipo de cliente y naturaleza de los
          datos tratados.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          4. Datos personales que podemos tratar
        </h3>
        <p className="mb-2">
          Dependiendo del servicio, configuracion y relacion contractual,
          MentorMind podra tratar las siguientes categorias:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="font-semibold">
              Datos de identificacion y contacto:
            </span>{" "}
            nombres y apellidos, documento de identidad cuando corresponda,
            correo electronico, telefono, empresa, cargo, area y pais.
          </li>
          <li>
            <span className="font-semibold">
              Datos de cuenta y autenticacion:
            </span>{" "}
            usuario, identificadores internos, credenciales protegidas, rol,
            permisos, estado de la cuenta y registros de acceso.
          </li>
          <li>
            <span className="font-semibold">
              Datos de formacion y desempeno:
            </span>{" "}
            cursos asignados, avance, fechas de acceso, tiempo de estudio,
            evaluaciones, resultados, intentos, certificaciones, asistencia y
            actividades realizadas.
          </li>
          <li>
            <span className="font-semibold">Datos de interaccion:</span>{" "}
            respuestas, comentarios, consultas, participacion en contenidos,
            retroalimentacion y registros generados dentro de la plataforma.
          </li>
          <li>
            <span className="font-semibold">Datos tecnicos:</span> direccion
            IP, tipo de dispositivo, navegador, sistema operativo,
            identificadores tecnicos, fecha y hora de conexion, logs, eventos
            de seguridad y diagnostico.
          </li>
          <li>
            <span className="font-semibold">Datos audiovisuales:</span>{" "}
            grabaciones de sesiones, voz, imagen o material audiovisual
            unicamente cuando la funcionalidad correspondiente este
            habilitada y exista base legal para su tratamiento.
          </li>
          <li>
            <span className="font-semibold">Datos de soporte:</span>{" "}
            informacion proporcionada al solicitar asistencia, reportar
            incidentes o comunicarse con el equipo de soporte.
          </li>
          <li>
            <span className="font-semibold">
              Datos generados por analitica:
            </span>{" "}
            metricas de uso, indicadores de adopcion, patrones de navegacion,
            progreso, cumplimiento y otros indicadores derivados del uso de
            MentorMind.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          5. Finalidades del tratamiento
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Crear, habilitar, administrar y autenticar cuentas de usuario.</li>
          <li>
            Proporcionar acceso a cursos, contenidos, evaluaciones y
            funcionalidades de aprendizaje.
          </li>
          <li>
            Registrar y mostrar el avance, participacion, asistencia,
            resultados y certificaciones.
          </li>
          <li>
            Generar reportes de uso, cumplimiento, adopcion y desempeno para
            usuarios autorizados y clientes corporativos.
          </li>
          <li>
            Personalizar la experiencia de aprendizaje, recomendaciones y
            contenidos cuando dicha funcionalidad este habilitada.
          </li>
          <li>
            Atender consultas, solicitudes de soporte, incidencias tecnicas y
            comunicaciones operativas.
          </li>
          <li>
            Mantener la disponibilidad, integridad, trazabilidad y seguridad
            de la plataforma.
          </li>
          <li>
            Detectar accesos no autorizados, fraude, abuso, incidentes de
            ciberseguridad y uso contrario a los terminos del servicio.
          </li>
          <li>
            Mejorar la calidad, usabilidad y desempeno tecnico del producto
            mediante informacion agregada o anonimizada cuando resulte
            posible.
          </li>
          <li>
            Cumplir obligaciones legales, contractuales, regulatorias y
            requerimientos validos de autoridades competentes.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          6. Base que legitima el tratamiento
        </h3>
        <p className="mb-2">
          MentorMind tratara datos personales unicamente cuando exista una
          base juridica valida. Dependiendo del contexto, el tratamiento
          podra sustentarse en el consentimiento del titular, la ejecucion de
          una relacion contractual, el cumplimiento de una obligacion legal,
          la relacion entre la organizacion cliente y sus colaboradores o
          usuarios, u otra base reconocida por la normativa aplicable.
        </p>
        <p>
          Cuando corresponda solicitar consentimiento, este debera ser
          libre, previo, expreso, inequivoco e informado. El titular podra
          revocarlo conforme a la normativa, sin afectar la licitud del
          tratamiento realizado antes de la revocacion.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          7. Tratamiento de informacion en clientes corporativos
        </h3>
        <p className="mb-2">
          En servicios contratados por empresas, instituciones educativas u
          otras organizaciones, determinados datos y reportes podran ser
          visibles para administradores, supervisores, formadores u otros
          perfiles autorizados por el cliente.
        </p>
        <p>
          El acceso estara limitado, en la medida tecnica y contractualmente
          posible, segun roles y permisos. La organizacion cliente es
          responsable de definir que usuarios estan autorizados para acceder
          a informacion de su personal o participantes y de comunicar a sus
          titulares las finalidades propias que correspondan.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          8. Inteligencia artificial, automatizacion y analitica
        </h3>
        <p className="mb-2">
          MentorMind puede incorporar funcionalidades de analitica,
          automatizacion o inteligencia artificial destinadas a facilitar la
          busqueda de contenidos, resumir informacion, recomendar recursos,
          apoyar procesos de formacion o generar indicadores.
        </p>
        <p className="mb-2">
          Cuando dichas funcionalidades impliquen tratamiento de datos
          personales, se aplicaran controles de acceso, minimizacion de
          datos y medidas de seguridad acordes con el riesgo. MentorMind no
          debera utilizar datos personales de clientes para entrenar modelos
          de inteligencia artificial de proposito general para fines propios,
          salvo que exista autorizacion expresa, base legal aplicable y una
          comunicacion transparente al titular o al cliente, segun
          corresponda.
        </p>
        <p>
          Las decisiones que produzcan efectos juridicos o impactos
          significativos sobre una persona no deberian basarse unicamente en
          resultados automatizados sin la revision humana y las garantias
          que exija la legislacion aplicable.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          9. Cookies y tecnologias similares
        </h3>
        <p className="mb-2">
          El sitio web o la plataforma pueden utilizar cookies,
          almacenamiento local y tecnologias equivalentes necesarias para
          mantener sesiones, recordar configuraciones, proteger cuentas,
          medir desempeno y comprender el uso de las funcionalidades.
        </p>
        <p>
          Cuando se utilicen cookies no estrictamente necesarias, se
          implementaran mecanismos de informacion y consentimiento cuando asi
          lo exija la normativa. La configuracion especifica debera
          detallarse en una Politica de Cookies o panel de preferencias, si
          corresponde.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          10. Comparticion y destinatarios de los datos
        </h3>
        <p className="mb-2">
          MentorMind podra compartir datos personales, de manera limitada,
          con:
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-2">
          <li>La organizacion cliente que contrato el servicio y sus usuarios autorizados.</li>
          <li>
            Proveedores de infraestructura en la nube, alojamiento, base de
            datos, autenticacion, mensajeria, analitica, soporte,
            videoconferencia o seguridad.
          </li>
          <li>
            Proveedores tecnologicos que actuen como encargados o
            subencargados del tratamiento bajo obligaciones de
            confidencialidad y seguridad.
          </li>
          <li>
            Autoridades administrativas, judiciales o regulatorias cuando
            exista obligacion legal o requerimiento valido.
          </li>
          <li>
            Asesores profesionales cuando resulte necesario para la defensa
            de derechos, auditoria, cumplimiento o gestion de riesgos.
          </li>
        </ul>
        <p>
          MentorMind no vende datos personales. Los proveedores deben acceder
          unicamente a la informacion necesaria para prestar el servicio
          contratado.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          11. Transferencias nacionales e internacionales
        </h3>
        <p>
          La infraestructura o determinados proveedores de MentorMind pueden
          encontrarse en Peru o en otros paises. Cuando exista flujo
          transfronterizo de datos personales, MentorMind y/o la
          organizacion responsable adoptaran las medidas contractuales,
          organizativas y legales necesarias conforme a la normativa peruana
          y a las reglas aplicables al servicio.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          12. Plazo de conservacion
        </h3>
        <p className="mb-2">
          Los datos personales seran conservados durante el tiempo necesario
          para cumplir las finalidades informadas, prestar el servicio,
          mantener registros contractuales o atender obligaciones legales.
          Los plazos pueden variar segun el tipo de informacion, la relacion
          con el cliente y las obligaciones de conservacion aplicables.
        </p>
        <p>
          Una vez finalizada la finalidad, los datos seran eliminados,
          anonimizados, bloqueados o conservados unicamente durante el plazo
          legalmente exigible, segun corresponda. Los respaldos tecnicos
          podran mantenerse temporalmente hasta completar sus ciclos
          normales de rotacion.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          13. Seguridad de la informacion
        </h3>
        <p className="mb-2">
          MentorMind aplicara medidas tecnicas, organizativas y de seguridad
          razonables y proporcionales al riesgo para proteger los datos
          personales contra perdida, acceso no autorizado, alteracion,
          divulgacion o destruccion.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Gestion de accesos y permisos por roles.</li>
          <li>Controles de autenticacion y registro de actividad.</li>
          <li>Proteccion de comunicaciones y credenciales.</li>
          <li>Copias de seguridad y mecanismos de recuperacion.</li>
          <li>Monitoreo de eventos de seguridad y gestion de vulnerabilidades.</li>
          <li>
            Politicas de confidencialidad y acceso restringido para personal
            autorizado.
          </li>
          <li>
            Evaluacion razonable de proveedores que procesen informacion por
            cuenta de MentorMind.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          14. Incidentes de seguridad
        </h3>
        <p>
          MentorMind mantendra procedimientos para detectar, analizar,
          contener y gestionar incidentes que puedan comprometer datos
          personales. Cuando corresponda conforme a la legislacion vigente,
          se realizaran las comunicaciones o notificaciones necesarias a la
          organizacion cliente, a los titulares y/o a la autoridad
          competente.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          15. Derechos de los titulares
        </h3>
        <p className="mb-2">
          Los titulares podran ejercer los derechos reconocidos por la
          normativa peruana de proteccion de datos personales, incluyendo,
          segun corresponda, los derechos de informacion, acceso,
          actualizacion, inclusion, rectificacion, supresion o cancelacion,
          oposicion, impedir el suministro, tratamiento objetivo, tutela y
          los demas derechos aplicables.
        </p>
        <p className="mb-2">
          Las solicitudes podran enviarse a [CORREO DE PRIVACIDAD], indicando
          el derecho que se desea ejercer y adjuntando la informacion
          necesaria para verificar la identidad del solicitante. MentorMind
          atendera las solicitudes dentro de los plazos establecidos por la
          normativa aplicable.
        </p>
        <p>
          Cuando MentorMind actue unicamente como encargado de tratamiento de
          una organizacion cliente, podra derivar o coordinar la solicitud
          con dicha organizacion, por ser quien determina las finalidades del
          tratamiento.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          16. Datos de menores de edad
        </h3>
        <p>
          MentorMind no esta dirigido de forma general a menores de edad
          salvo que el servicio haya sido expresamente contratado para un
          contexto educativo o formativo que los incluya. En dichos casos, el
          tratamiento debera realizarse con las garantias, autorizaciones y
          medidas reforzadas que exija la ley.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">17. Confidencialidad</h3>
        <p>
          El personal y terceros autorizados que accedan a datos personales
          deberan mantener deberes de confidencialidad y utilizar la
          informacion unicamente para las funciones o servicios autorizados.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          18. Enlaces y servicios de terceros
        </h3>
        <p>
          MentorMind puede incluir enlaces o integraciones con servicios de
          terceros. El tratamiento de informacion realizado directamente por
          dichos terceros podra estar sujeto a sus propias politicas de
          privacidad. Se recomienda revisar las condiciones de privacidad de
          cada servicio externo.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">
          19. Actualizaciones de esta Politica
        </h3>
        <p>
          MentorMind podra actualizar esta Politica para reflejar cambios en
          sus servicios, tecnologias, proveedores o requisitos legales. La
          version vigente indicara su fecha de actualizacion. Cuando los
          cambios sean sustanciales y corresponda, se comunicaran a los
          usuarios o clientes por medios adecuados.
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">20. Canal de contacto</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="font-semibold bg-gray-50 p-2 w-1/3">
                  Responsable / empresa
                </td>
                <td className="p-2">[RAZON SOCIAL]</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-semibold bg-gray-50 p-2">RUC</td>
                <td className="p-2">[RUC]</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-semibold bg-gray-50 p-2">
                  Correo de privacidad
                </td>
                <td className="p-2">[CORREO DE PRIVACIDAD]</td>
              </tr>
              <tr>
                <td className="font-semibold bg-gray-50 p-2">
                  Domicilio / canal fisico
                </td>
                <td className="p-2">[DOMICILIO O CANAL DE ATENCION]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-2">21. Control de version</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left font-semibold p-2">Version</th>
                <th className="text-left font-semibold p-2">Fecha</th>
                <th className="text-left font-semibold p-2">Descripcion</th>
                <th className="text-left font-semibold p-2">Aprobado por</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 align-top">1.0</td>
                <td className="p-2 align-top">31/08/2026</td>
                <td className="p-2 align-top">
                  Emision inicial de la Politica de Privacidad
                </td>
                <td className="p-2 align-top">[RESPONSABLE]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-gray-400 italic border-t border-gray-200 pt-4">
        Nota legal: Este documento es un modelo general y no sustituye
        asesoria legal. Antes de su publicacion debe verificarse la razon
        social responsable, los bancos de datos personales involucrados,
        proveedores/subencargados, transferencias internacionales, plazos
        reales de conservacion, canales ARCO, cookies y las funcionalidades
        efectivamente habilitadas en MentorMind.
      </p>
    </div>
  );
}
