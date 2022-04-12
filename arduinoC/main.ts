/** 
 * @file yfrobot
 * @brief YFROBOT's Motor Speed Mesurement Mind+ library.
 * @n This is a MindPlus graphics programming extension for YFROBOT's module.
 * 
 * @copyright    YFROBOT,2022
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](yfrobot@qq.com)
 * @date  2022-04-12
*/

enum ODMONOFF {
    //% block="OFF"
    LOW,
    //% block="ON"
    HIGH
}

enum OMDDIGITAL {
    //% block="LED"
    LED,
    //% block="Active Buzzer"
    BUZZERACTIVE,
    //% block="Fan"
    FAN,
    //% block="Vibration Motor"
    VIBRATIONMOTOR,
    //% block="Relay"
    RELAY
}

enum OMAANALOG {
    //% block="LED"
    LED,
    //% block="Fan"
    FAN,
    //% block="Vibration Motor"
    VIBRATIONMOTOR
}

enum TRAFFICLIGHTSTA {
    //% block="All Off"
    0,
    //% block="LED-RED ON"
    1,
    //% block="LED-YELLOW ON"
    2,
    //% block="LED-GREEN ON"
    3
}


//% color="#7a7374" iconWidth=50 iconHeight=40
namespace motorMesurement {

    //% block="Motor speed mesurement on EN-A [ENAPIN]" blockType="reporter"
    //% ENAPIN.shadow="dropdown" ENAPIN.options="PIN_ExternalInterrupts"
    export function speedMesurement(parameter: any, block: any) {
        let enaPin = parameter.ENAPIN.code;

        // Generator.addInclude(`defineEncoderA_${enaPin}`, `#define encodreA ${enaPin}\n`)
        // Generator.addInclude(`defineupdateEncoder_${enaPin}`, `PROGMEM void updateEncoder_${enaPin}(); // 更新编码器值函数\n`)
        
        Generator.addInclude(`defineEncoderValue_${enaPin}`, `volatile long encoder_${enaPin}_Value = 0; \n`)

        Generator.addInclude(`defineupdateEncoder_t_${enaPin}`, 
            `void updateEncoder_${enaPin}() {  // 更新编码器值函数\n`+
            `  encoder_${enaPin}_Value++;\n`+
            `}`
        );

        Generator.addSetup(`pinMode_${enaPin}`, `pinMode(${enaPin}, INPUT_PULLUP); // 将A相引脚设置为输入上拉`);
        Generator.addSetup(`attachInterrupt_${enaPin}`, `attachInterrupt(digitalPinToInterrupt(${enaPin}), updateEncoder_${enaPin}, RISING);`);

        Generator.addCode(`encoder_${enaPin}_Value`);
    }

    
    //% block="Encoder Value Clear on EN-A [ENAPIN] " blockType="command"
    //% ENAPIN.shadow="dropdown" ENAPIN.options="PIN_ExternalInterrupts"
    export function speedMesurementValueClear(parameter: any, block: any) {
        let enaPin = parameter.ENAPIN.code;
        Generator.addCode(`encoder_${enaPin}_Value = 0;`);
    }

    //% block="Motor speed mesurement on EN-A [ENAPIN] EN-B [ENBPIN] " blockType="command"
    //% ENAPIN.shadow="dropdown" ENAPIN.options="PIN_ExternalInterrupts"
    //% ENBPIN.shadow="dropdown" ENBPIN.options="PIN_DigitalWrite"
    //% OAMSTATE.shadow="range"   OAMSTATE.params.min=0    OAMSTATE.params.max=255    OAMSTATE.defl=200
    export function speedMesurementWithDir(parameter: any, block: any) {
        let outputModule = parameter.OUTPUTMODULEANALOG.code;
        let outputModulePin = parameter.OAMPIN.code;
        let outputModuleState = parameter.OAMSTATE.code;
        if(Generator.board === 'esp32'){//如果是掌控板，生成如下代码
            // Generator.addCode(`pwmv = map(${outputModuleState}, 0, 255, 0, 1023);`);
            Generator.addCode(`analogWrite(${outputModulePin},map(${outputModuleState}, 0, 255, 0, 1023));`);
        }else{
            Generator.addCode(`analogWrite(${outputModulePin},${outputModuleState});`);
        }
    }
}
