# Parallax

**Simula el cambio antes de aplicarlo. Y te decimos cuánto de eso fue real.**

No existe un ambiente de pruebas para la forma en que opera un negocio. Cambias
un precio, una política de devoluciones, el umbral de escalamiento — y te
enteras de lo que pasó cuando ya pasó, normalmente porque te lo dijo un cliente.

## Qué hace

Le apuntas a un contexto y Parallax **propone una ontología construida con lo que
realmente hay ahí**: qué cosas existen, qué acciones son posibles, qué no puede
dejar de ser cierto nunca. Tres tipos de contexto, todos de primera clase:

- los datos de tu negocio,
- el espacio de trabajo de un agente,
- o una carpeta cualquiera que describa una situación.

**Tú la aceptas antes de que quede activa.** Ese paso no es un trámite: es el
producto. Una ontología que nadie revisó no debería poder producir números que
se ven autoritativos. Si falta una unidad en una cantidad numérica, el sistema
se niega a activarla — falla cerrado, no adivina.

Ya activa, corre ese modelo hacia adelante bajo las decisiones que estás
considerando, y compara contra lo que de verdad pasó.

## Por qué creerle

Un simulador produce números seguros sobre un mundo que no existe, y casi nunca
te da cómo verificarlos. Nosotros no apostamos por «más fidelidad», que no se
puede comprobar en tres minutos de demo. Apostamos por algo que sí:

- **La transición y las invariantes son código, nunca un modelo.** Ningún modelo
  calcula un libro contable y ningún modelo decide si una restricción se cumplió.
- **Una política no puede certificarse a sí misma.** La corremos varias veces
  contra la misma prueba; si no logra reproducir su propio resultado con la
  misma semilla, la degradamos en código sin importar lo que declare — y la
  degradación queda escrita en la rama.
- **Cada respuesta viene tipada `observada | simulada`.** Un valor derivado de
  algo simulado es simulado, por mucho dato real que haya entrado al lado.

La meta no es un simulador que acierte. Es **un simulador que no pueda mentir
sobre ser un simulador**.

## Cómo se usa

Por WhatsApp. Escribes, el runtime lee tu propio espacio de trabajo, te propone
la ontología en el chat, respondes las preguntas que bloquean, aceptas — y te
devuelve el resultado con un enlace al recibo: qué corrió, qué se rompió, qué
declaró la política frente a lo que demostró, y el hash con el que puedes
volver a reproducirlo.

WhatsApp porque es donde ya opera América Latina. Es un canal, no el producto:
la misma capacidad se alcanza por consola o por API, con errores tipados y
legibles por máquina. El agente es un usuario, no una librería cliente.

## Estado honesto

El runtime, el log con bifurcación copy-on-write, la retícula de
reproducibilidad, el verificador de invariantes de conservación y la compuerta
de aceptación existen y corren. El adaptador de LLM, el segundo dominio y la
consola web están diseñados y no construidos.

Nada aquí está calibrado contra un negocio real, porque no tenemos transcripciones
reales todavía. Preferimos decirlo a publicar un porcentaje de precisión que no
podemos sustentar.

---

Track: Simulations · team-5 · Platanus Hack 26 Bogotá
