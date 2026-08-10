Programa: 
- Touchdesigner 
- VCV Rack 

---
Sinestesia entre imagen y sonido

El proyecto se basa en una cámara, funcionando como un “ojo digital”, que capta el entorno visual tal como lo haría un ojo biológico. Esta cámara no solo graba, sino que envía en tiempo real datos de imagen —en formato RGBA (rojo, verde, azul y alfa)— a TouchDesigner, que actúa como decodificador y procesador de esta información.

TouchDesigner (de Derivative) interpreta cada píxel captado por la cámara, extrayendo los valores exactos de color. Esto se logra mediante su sistema de nodos, especialmente los TOPs (Texture Operators), que permiten manipular imágenes cuadro por cuadro con aceleración por GPU. Cada valor de color se convierte en datos numéricos que pueden controlarse y mapearse con precisión.

Estos datos son enviados a VCV Rack usando el protocolo OSC (Open Sound Control), un estándar para comunicación en tiempo real entre aplicaciones multimedia. Allí, VCV Rack, una plataforma de síntesis modular virtual, toma estos valores como parámetros para modular sus sintetizadores virtuales. Esto puede implicar que el valor de un canal rojo controle la frecuencia de un oscilador, el canal verde module un filtro, o el canal alfa afecte la amplitud de una señal, entre muchas posibilidades.

VCV Rack reproduce de forma digital el entorno de los sintetizadores Eurorack, permitiendo al usuario construir sistemas de sonido personalizados mediante módulos interconectables, con soporte para polifonía, MIDI, y procesamiento paralelo multicanal.

Este sistema crea una relación directa entre el entorno visual y el paisaje sonoro: la luz y el color se traducen en tono, ritmo y textura sonora, generando una experiencia audiovisual generativa, reactiva y única.
---
