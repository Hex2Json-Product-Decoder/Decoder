/**
* @description: 处理mqtt接收到的消息
* @param {any} value - Payload 接收到的消息并且经过解码后的字符串
* @param {string} msgType - 消息的类型,是订阅消息还是发送消息 'received' or 'publish'
* @param {number} index - 消息的索引 Index of the message, valid only when script is used in the publish message and timed message is enabled
* @return {any} - 经过处理后的消息 Payload after script processing
*/

var typeCodeArray = ["ibeacon", "eddystone-uid", "eddystone-url", "eddystone-tlm", "bxp-devifo", "bxp-acc", "bxp-th", "bxp-button", "bxp-tag", "pir", "other", "tof"];
var samplingRateArray = ["1hz", "10hz", "25hz", "50hz", "100hz"];
var fullScaleArray = ["2g", "4g", "8g", "16g"];
var frameTypeArray = ["Single press mode", "Double press mode", "Long press mode", "Abnormal"];
var pirDelayResponseStatusArray = ["Low", "Medium", "High"];
var fixModeArray = ["Periodic", "Motion", "Downlink"];
var fixResultArray = ["GPS fix success", "LBS fix success", "Interrupted by Downlink", "GPS serial port is used", "GPS aiding timeout", "GPS timeout", "PDOP limit", "LBS failure"];
function handlePayload(value, msgType, index) {
    const hexStrArray = toHexStrArray(value);
    var len = hexStrArray.length;
    if (len > 11) {
        var data = {};
        data.flag = hexStrArray.slice(1, 3).join("");
        data.gatewayMac = hexStrArray.slice(3, 9).join("");
        data.length = parseHexStrArraytoInt(hexStrArray.slice(9, 11));
        var deviceDataArray = hexStrArray.slice(11, len);
        var deviceDataIndex = 0;
        var deviceDataLength = deviceDataArray.length;
        if (data.flag == '3089' || data.flag == '30b1') {
            // Fix data
            var fixData = {};
            var deviceDataArray = hexStrArray.slice(11, hexStrArray.length);
            var deviceDataIndex = 0;
            var deviceDataLength = deviceDataArray.length;
            for (; deviceDataIndex < deviceDataLength;) {
                var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
                deviceDataIndex++;
                var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
                deviceDataIndex += 2;
                if (paramTag == 0) {
                    fixData.timestamp = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
                    fixData.current_time = parse_time(fixData.timestamp, 0);
                } else if (paramTag == 1) {
                    fixData.fixMode = fixModeArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
                } else if (paramTag == 2) {
                    fixData.fixResult = fixResultArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
                } else if (paramTag == 3) {
                    fixData.longitude = Number(signedHexToInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength - 4).join("")) * 0.0000001).toFixed(7);
                    fixData.latitude = Number(signedHexToInt(deviceDataArray.slice(deviceDataIndex + 4, deviceDataIndex + paramLength).join("")) * 0.0000001).toFixed(7);
                } else if (paramTag == 4) {
                    fixData.tac_lac = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & x0FFFF;
                    fixData.ci = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & x0FFFFFFFF;
                }
                deviceDataIndex += paramLength;
            }
            data.fixData = fixData;
            return JSON.stringify(data);
        } else if (data.flag == '30a0' || data.flag == '30b2') {
            // Scan devices
            var deviceArray = [];
            var deviceDataArray = hexStrArray.slice(11, hexStrArray.length);
            var deviceDataIndex = 0;
            var deviceDataLength = deviceDataArray.length;
            var deviceItem = {};
            for (; deviceDataIndex < deviceDataLength;) {
                var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
                deviceDataIndex++;
                if (paramTag == 0) {
                    // typeCode
                    // var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
                    if (Object.keys(deviceItem).length != 0) {
                        deviceArray.push(deviceItem);
                    }
                    deviceItem = {};
                    deviceDataIndex += 2;
                    deviceItem.typeCode = parseInt(deviceDataArray[deviceDataIndex], 16);
                    deviceItem.type = typeCodeArray[deviceItem.typeCode];
                    deviceDataIndex++;
                } else if (paramTag == 0x01) {
                    // mac
                    // var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
                    deviceDataIndex += 2;
                    deviceItem.mac = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 6).join("");
                    deviceDataIndex += 6;
                } else if (paramTag == 0x02) {
                    // connectable
                    // var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
                    deviceDataIndex += 2;
                    deviceItem.connectable = parseInt(deviceDataArray[deviceDataIndex], 16) == 0 ? "Unconnectable" : "Connectable";
                    deviceDataIndex++;
                } else if (paramTag == 0x03) {
                    // timestamp
                    // var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
                    deviceDataIndex += 2;
                    deviceItem.timestamp = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 4));
                    deviceDataIndex += 4;
                    deviceItem.timezone = parseInt(deviceDataArray[deviceDataIndex], 16);
                    deviceDataIndex++;
                    deviceItem.current_time = parse_time(deviceItem.timestamp, deviceItem.timezone);
                } else if (paramTag == 0x04) {
                    // rssi
                    // var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
                    deviceDataIndex += 2;
                    deviceItem.rssi = parseInt(deviceDataArray[deviceDataIndex], 16) - 256;
                    deviceDataIndex++;
                } else if (paramTag == 0x05) {
                    // adv_packet
                    var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
                    deviceDataIndex += 2;
                    deviceItem.advPacket = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
                    deviceDataIndex += paramLength;
                } else if (paramTag == 0x06) {
                    // response_packet
                    var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
                    deviceDataIndex += 2;
                    deviceItem.responsePacket = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
                    deviceDataIndex += paramLength;
                } else if (paramTag >= 0x0A) {
                    // 需要根据typeCode判断
                    var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
                    deviceDataIndex += 2;
                    if (deviceItem.typeCode == 0) {
                        parseIbeacon(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength);
                    } else if (deviceItem.typeCode == 1) {
                        parseEddystoneUID(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength);
                    } else if (deviceItem.typeCode == 2) {
                        parseEddystoneURL(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength);
                    } else if (deviceItem.typeCode == 3) {
                        parseEddystoneTLM(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength);
                    } else if (deviceItem.typeCode == 4) {
                        parseDeviceInfo(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength);
                    } else if (deviceItem.typeCode == 5) {
                        parseBXPACC(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength);
                    } else if (deviceItem.typeCode == 6) {
                        parseBXPTH(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength);
                    } else if (deviceItem.typeCode == 7) {
                        parseBXPButton(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength);
                    } else if (deviceItem.typeCode == 8) {
                        parseBXPTag(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength);
                    } else if (deviceItem.typeCode == 9) {
                        parsePIR(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength);
                    } else if (deviceItem.typeCode == 11) {
                        parseTOF(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength);
                    } else if (deviceItem.typeCode == 10) {
                        parseOther(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength);
                    }
                    deviceDataIndex += paramLength;
                }
            }
            if (Object.keys(deviceItem).length != 0) {
                deviceArray.push(deviceItem);
            }
            data.deviceArray = deviceArray;
            return JSON.stringify(data);
        }
    }
    return value;
}


function parseIbeacon(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength) {
    if (paramTag == 0x0A) {
        deviceItem.uuid = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x0B) {
        deviceItem.major = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x0C) {
        deviceItem.minor = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x0D) {
        deviceItem.rssi_1m = signedHexToInt(deviceDataArray[deviceDataIndex]);
    }
}

function parseEddystoneUID(paramTag, deviceDataArray, deviceDataIndex, paramLength) {
    if (paramTag == 0x0A) {
        deviceItem.namespace = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x0B) {
        deviceItem.rssi_0m = signedHexToInt(deviceDataArray[deviceDataIndex]);
    } else if (paramTag == 0x0C) {
        deviceItem.instance = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    }
}

function parseEddystoneURL(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength) {
    if (paramTag == 0x0A) {
        deviceItem.url = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x0B) {
        deviceItem.rssi_0m = signedHexToInt(deviceDataArray[deviceDataIndex]);
    }
}


function parseEddystoneTLM(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength) {
    if (paramTag == 0x0A) {
        deviceItem.tlmVersion = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x0B) {
        deviceItem.battVoltage = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) + "mV";
    } else if (paramTag == 0x0C) {
        deviceItem.temperature = Number(signedHexToInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength) / 256).toFixed(1).join("")) + "℃";
    } else if (paramTag == 0x0D) {
        deviceItem.advCnt = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x0E) {
        deviceItem.escCnt = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    }
}

function parseDeviceInfo(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength) {
    if (paramTag == 0x0A) {
        deviceItem.txPower = signedHexToInt(deviceDataArray[deviceDataIndex]);
    } else if (paramTag == 0x0B) {
        deviceItem.rangingData = signedHexToInt(deviceDataArray[deviceDataIndex]);
    } else if (paramTag == 0x0C) {
        deviceItem.advInterval = parseInt(deviceDataArray[deviceDataIndex], 16) * 100 + "ms";
    } else if (paramTag == 0x0D) {
        deviceItem.battVoltage = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) + "mV";
    } else if (paramTag == 0x0E) {
        deviceItem.passwordVerificateStatus = parseInt(deviceDataArray[deviceDataIndex], 16) & 0x03 == 0 ? "Enable" : "Disable";
        deviceItem.ambientLightSensorStatus = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 2) & 0x01 == 0 ? "Enable" : "Disable";
        deviceItem.hallDoorSensorStatus = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 3) & 0x01 == 0 ? "Enable" : "Disable";
    } else if (paramTag == 0x0F) {
        deviceItem.connectable = parseInt(deviceDataArray[deviceDataIndex], 16) & 0x01 == 0 ? "Enable" : "Disable";
        deviceItem.ambientLightStatus = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 1) & 0x01 == 0 ? "Enable" : "Disable";
        deviceItem.doorStatus = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 2) & 0x01 == 0 ? "Enable" : "Disable";
    } else if (paramTag == 0x10) {
        deviceItem.firmwareVersion = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x11) {
        deviceItem.deviceName = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    }
}

function parseBXPACC(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength) {
    if (paramTag == 0x0A) {
        deviceItem.txPower = signedHexToInt(deviceDataArray[deviceDataIndex]);
    } else if (paramTag == 0x0B) {
        deviceItem.rangingData = signedHexToInt(deviceDataArray[deviceDataIndex]);
    } else if (paramTag == 0x0C) {
        deviceItem.advInterval = parseInt(deviceDataArray[deviceDataIndex], 16) * 100 + "ms";
    } else if (paramTag == 0x0D) {
        deviceItem.samplingRate = samplingRateArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
    } else if (paramTag == 0x0E) {
        deviceItem.fullScale = fullScaleArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
    } else if (paramTag == 0x0F) {
        deviceItem.motionThreshold = parseInt(deviceDataArray[deviceDataIndex], 16) * 0.1 + "g";
    } else if (paramTag == 0x10) {
        var axis_data_array = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength);
        deviceItem.axisDataX = axis_data_array[0] + "mg";
        deviceItem.axisDataY = axis_data_array[1] + "mg";
        deviceItem.axisDataZ = axis_data_array[2] + "mg";
    } else if (paramTag == 0x11) {
        deviceItem.battVoltage = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) + "mV";
    }
}
function parseBXPTH(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength) {
    if (paramTag == 0x0A) {
        deviceItem.txPower = signedHexToInt(deviceDataArray[deviceDataIndex]);
    } else if (paramTag == 0x0B) {
        deviceItem.rangingData = signedHexToInt(deviceDataArray[deviceDataIndex]);
    } else if (paramTag == 0x0C) {
        deviceItem.advInterval = parseInt(deviceDataArray[deviceDataIndex], 16) * 100 + "ms";
    } else if (paramTag == 0x0D) {
        deviceItem.temperature = Number(signedHexToInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("")) * 0.1).toFixed(1) + "℃";
    } else if (paramTag == 0x0E) {
        deviceItem.humidity = Number(signedHexToInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("")) * 0.1).toFixed(1) + "%";
    } else if (paramTag == 0x0F) {
        deviceItem.battVoltage = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) + "mV";
    }
}

function parseBXPButton(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength) {
    if (paramTag == 0x0A) {
        deviceItem.frameType = frameTypeArray[parseInt(deviceDataArray[deviceDataIndex], 16) & 0x0F];
    } else if (paramTag == 0x0B) {
        deviceItem.passwordVerifyFlag = parseInt(deviceDataArray[deviceDataIndex], 16) & 0x01;
        deviceItem.triggerStatus = parseInt(deviceDataArray[deviceDataIndex], 16) >> 1 & 0x01;
    } else if (paramTag == 0x0C) {
        deviceItem.triggerCount = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x0D) {
        deviceItem.devId = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x0E) {
        deviceItem.firmwareType = parseInt(deviceDataArray[deviceDataIndex], 16);
    } else if (paramTag == 0x0F) {
        deviceItem.devName = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x10) {
        deviceItem.fullScale = fullScaleArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
    } else if (paramTag == 0x11) {
        deviceItem.motionThreshold = parseInt(deviceDataArray[deviceDataIndex], 16) * 0.1 + "g";
    } else if (paramTag == 0x12) {
        var axis_data_array = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength);
        deviceItem.axisDataX = axis_data_array[0] + "mg";
        deviceItem.axisDataY = axis_data_array[1] + "mg";
        deviceItem.axisDataZ = axis_data_array[2] + "mg";
    } else if (paramTag == 0x13) {
        deviceItem.temperature = Number(signedHexToInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("")) * 0.25).toFixed(1) + "℃";
    } else if (paramTag == 0x14) {
        deviceItem.rangingData = signedHexToInt(deviceDataArray[deviceDataIndex]);
    } else if (paramTag == 0x15) {
        deviceItem.battVoltage = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) + "mV";
    } else if (paramTag == 0x16) {
        deviceItem.txPower = signedHexToInt(deviceDataArray[deviceDataIndex]);
    }
}

function parseBXPTag(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength) {
    if (paramTag == 0x0A) {
        deviceItem.hallSensorStatus = parseInt(deviceDataArray[deviceDataIndex], 16) & 0x01 == 1 ? "Enable" : "Disable";
        deviceItem.axisStatus = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 1) & 0x01 == 1 ? "Enable" : "Disable";
        deviceItem.axisEquippedStatus = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 2) & 0x01 == 1 ? "Enable" : "Disable";
    } else if (paramTag == 0x0B) {
        deviceItem.hallTriggerEventCount = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x0C) {
        deviceItem.motionTriggerEventCount = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x0D) {
        var axis_data_array = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength);
        deviceItem.axisDataX = axis_data_array[0] + "mg";
        deviceItem.axisDataY = axis_data_array[1] + "mg";
        deviceItem.axisDataZ = axis_data_array[2] + "mg";
    } else if (paramTag == 0x0E) {
        deviceItem.battVoltage = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) + "mV";
    } else if (paramTag == 0x0F) {
        deviceItem.tagId = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x10) {
        deviceItem.devName = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    }
}


function parsePIR(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength) {
    if (paramTag == 0x0A) {
        deviceItem.pirDelayResponseStatus = pirDelayResponseStatusArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
    } else if (paramTag == 0x0B) {
        deviceItem.doorStatus = parseInt(deviceDataArray[deviceDataIndex], 16) == 0 ? "open" : "close";
    } else if (paramTag == 0x0C) {
        deviceItem.sensorSensitivity = pirDelayResponseStatusArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
    } else if (paramTag == 0x0D) {
        deviceItem.sensorDetectionStatus = parseInt(deviceDataArray[deviceDataIndex], 16) == 0 ? "no effective motion" : "effective motion";
    } else if (paramTag == 0x0E) {
        deviceItem.battVoltage = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) + "mV";
    } else if (paramTag == 0x0F) {
        deviceItem.major = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x10) {
        deviceItem.minor = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x11) {
        deviceItem.rssi_1m = signedHexToInt(deviceDataArray[deviceDataIndex]);
    } else if (paramTag == 0x12) {
        deviceItem.txPower = signedHexToInt(deviceDataArray[deviceDataIndex]);
    } else if (paramTag == 0x13) {
        deviceItem.devName = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    }

}

function parseTOF(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength) {
    if (paramTag == 0x0A) {
        deviceItem.manufacturerVendorCode = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x0B) {
        deviceItem.battVoltage = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) + "mV";
    } else if (paramTag == 0x0C) {
        deviceItem.userData = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    } else if (paramTag == 0x0D) {
        deviceItem.randingDistance = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
    }
}

function parseOther(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength) {
    if (paramTag == 0x0A) {
        deviceItem.dataBlock1 = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x0B) {
        deviceItem.dataBlock2 = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x0C) {
        deviceItem.dataBlock3 = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x0D) {
        deviceItem.dataBlock4 = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x0E) {
        deviceItem.dataBlock5 = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x0F) {
        deviceItem.dataBlock6 = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x10) {
        deviceItem.dataBlock7 = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x11) {
        deviceItem.dataBlock8 = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x12) {
        deviceItem.dataBlock9 = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    } else if (paramTag == 0x13) {
        deviceItem.dataBlock10 = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
    }
}

function signedHexToInt(hexStr) {
    var twoStr = parseInt(hexStr, 16).toString(2); // 将十六转十进制，再转2进制
    var bitNum = hexStr.length * 4; // 1个字节 = 8bit ，0xff 一个 "f"就是4位
    if (twoStr.length < bitNum) {
        while (twoStr.length < bitNum) {
            twoStr = "0" + twoStr;
        }
    }
    if (twoStr.substring(0, 1) == "0") {
        // 正数
        twoStr = parseInt(twoStr, 2); // 二进制转十进制
        return twoStr;
    }
    // 负数
    var twoStr_unsign = "";
    twoStr = parseInt(twoStr, 2) - 1; // 补码：(负数)反码+1，符号位不变；相对十进制来说也是 +1，但这里是负数，+1就是绝对值数据-1
    twoStr = twoStr.toString(2);
    twoStr_unsign = twoStr.substring(1, bitNum); // 舍弃首位(符号位)
    // 去除首字符，将0转为1，将1转为0   反码
    twoStr_unsign = twoStr_unsign.replace(/0/g, "z");
    twoStr_unsign = twoStr_unsign.replace(/1/g, "0");
    twoStr_unsign = twoStr_unsign.replace(/z/g, "1");
    twoStr = parseInt(-twoStr_unsign, 2);
    return twoStr;
}

function hexStrToString(value) {
    let array = []
    let arrLen = value.length
    for (var i = 0; i < arrLen; i++) {
        array.push(String.fromCharCode(parseInt(value[i], 16)));
    }
    return array.join("")
}

/**
 * @description: 
 * 将value(payload)转为hex字符串数组并返回
 * 例如:
 *  输入: "3C3C 0014"
 *  输出: ["3C", "3C", "00", "14"]
 *
 * @param {any} value - Payload,类型是string
 * @return {any} - hex字符串数组
 */
function toHexStrArray(value) {
    const rep = value.replace(/\s*/g, "")
    let array = []
    let arrLen = rep.length / 2
    for (var i = 0; i < arrLen; i++) {
        array.push(rep.substr(i * 2, 2))
    }
    return array
}

/**
 * @description: 
 * 大端模式下,将hex字符串数组转为整形数
 * 例如:
 *  输入:["ff","ff"] 
 *  输出:65535
 * 
 * @param {array} hexStrArray - hex字符串数组
 * @return {number} - 整形数
 */
function parseHexStrArraytoInt(hexStrArray) {
    return parseInt(hexStrArray.join(""), 16)
}

/**
 * @description: 从hex字符串中提取位,返回0或者1
 * 
 * @param {string} hexStr - hex字符串
 * @param {number} bitNum - 取第几位,低位从右边开始,最小为1
 * @return {number} - 0或者1
 */
function extractBitFromHexStr(hexStr, bitNum) {
    return (parseInt(hexStr, 16) >>> (bitNum - 1)) & 1
}

function parse_time(timestamp, timezone) {
    timezone = timezone > 64 ? timezone - 128 : timezone;
    timestamp = timestamp + timezone * 3600;
    if (timestamp < 0) {
        timestamp = 0;
    }

    var d = new Date(timestamp * 1000);
    //d.setUTCSeconds(1660202724);

    var time_str = "";
    time_str += d.getUTCFullYear();
    time_str += "-";
    time_str += formatNumber(d.getUTCMonth() + 1);
    time_str += "-";
    time_str += formatNumber(d.getUTCDate());
    time_str += " ";

    time_str += formatNumber(d.getUTCHours());
    time_str += ":";
    time_str += formatNumber(d.getUTCMinutes());
    time_str += ":";
    time_str += formatNumber(d.getUTCSeconds());

    return time_str;
}

function formatNumber(number) {
    return number < 10 ? "0" + number : number;
}


/**
 * @description: 执行handlePayload方法
 */
execute(handlePayload)