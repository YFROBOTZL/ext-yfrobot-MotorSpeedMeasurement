// 无法使用
    
    //% block="voice Broadcast module continuous play [PIN1] [ADDRESS]" blockType="command"
    //% PIN1.shadow="dropdown" PIN1.options="PIN_DigitalWrite"
    //% ADDRESS.shadow="dropdownRound" ADDRESS.options="OTPADDRESS" ADDRESS.defl="OTPADDRESS.00"
    export function voiceBroadcastCPlay(parameter: any, block: any) {
        let vbPin1 = parameter.PIN1.code;
        let vbAddress = parameter.ADDRESS.code;
        Generator.addInclude(`definevoiceBroadcastFun1`, `PROGMEM void voiceBroadcastSendData(int voicePin, int addr); // 语音播报模块函数-发送数据-无起始位\n`)
        Generator.addInclude(`definevoiceBroadcastFun2`, `PROGMEM void voiceBroadcastSendDataWithStart(int voicePin, int addr);// 语音播报模块函数-发送数据-有起始位\n`)
        Generator.addInclude(`definevoiceBroadcastFun3`, `PROGMEM void voiceBroadcastCPlay(int voicePin, int serial_number[], int sizes);// 语音播报模块函数-连续播报\n`)

        Generator.addInclude(`definevoiceBroadcastFunA`, `// 语音播报模块函数-发送数据-无起始位\n`+
            `void voiceBroadcastSendData(int voicePin, int addr) {\n`+
            `  for (int i = 0; i < 8; i++) {\n`+
            `    digitalWrite(voicePin, HIGH);\n`+
            `    if (addr & 1) {\n`+
            `      delayMicroseconds(2400); // >2400us\n`+
            `      digitalWrite(voicePin, LOW);\n`+
            `      delayMicroseconds(800);  // >800us\n`+
            `    } else {\n`+
            `      delayMicroseconds(800);  // >800us\n`+
            `      digitalWrite(voicePin , LOW);\n`+
            `      delayMicroseconds(2400); // >2400us\n`+
            `    }\n`+
            `    addr >>= 1;\n`+
            `  }\n`+
            `  digitalWrite(voicePin, HIGH);\n`+
            `}`
        );
        
        Generator.addInclude(`definevoiceBroadcastFunB`, `// 语音播报模块函数-发送数据-有起始位\n`+
            `void voiceBroadcastSendDataWithStart(int voicePin, int addr) {\n`+
            `  digitalWrite(voicePin , HIGH);\n`+
            `  delay(1);           // >2ms\n`+
            `  digitalWrite(voicePin , LOW);\n`+
            `  delay(3);           // >2ms\n`+
            `  voiceBroadcastSendData(voicePin ,addr);\n`+
            `}`
        );
        
        Generator.addInclude("definevoiceBroadcastFunC", `// 语音播报模块函数-连续播报\n`+
            `void voiceBroadcastCPlay(int voicePin, int serial_number[], int sizes) {\n`+
            `  int checksum = 0;\n`+
            `  voiceBroadcastSendData2(voicePin, 0xf1); // 头码\n`+
            `  checksum += 0xf1;\n`+
            `  for (int index = 0; index < sizes; index++) {\n`+
            `    voiceBroadcastSendData(voicePin, serial_number[index]); // 语音列表码\n`+
            `    checksum += serial_number[index];\n`+
            `  }\n`+
            `  voiceBroadcastSendData2(voicePin, 0xf3); // 尾码\n`+
            `  checksum += 0xF3;\n`+
            `  yfOTPSendDataNoStartCode(otppin, checksum && 0xFF); // 校验和\n`+
            `}`
        );
        Generator.addCode(`voiceBroadcastSendData(${vbPin1},${vbAddress});`);
    }
