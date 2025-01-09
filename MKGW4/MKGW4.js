/**
* @description: default script
* @param {any} value - Payload
* @param {string} msgType - Message type, value is 'received' or 'publish'
* @param {number} index - Index of the message, valid only when script is used in the publish message and timed message is enabled
* @return {any} - Payload after script processing
*/

var typeCodeArray = ["ibeacon", "eddystone-uid", "eddystone-url", "eddystone-tlm", "bxp-devifo", "bxp-acc", "bxp-th", "bxp-button", "bxp-tag", "pir", "other", "tof"];
var samplingRateArray = ["1hz", "10hz", "25hz", "50hz", "100hz"];
var fullScaleArray = ["2g", "4g", "8g", "16g"];
var frameTypeArray = ["Single press mode", "Double press mode", "Long press mode", "Abnormal"];
var pirDelayResponseStatusArray = ["Low", "Medium", "High"];
var fixModeNotifyArray = ["Periodic", "Motion", "Downlink"];
var fixResultArray = ["GPS fix success", "LBS fix success", "Interrupted by Downlink", "GPS serial port is used", "GPS aiding timeout", "GPS timeout", "PDOP limit", "LBS failure"];
var lowPowerArray = ["10%", "20%", "30%", "40%", "50%"];
var scannerReportArray = ["Scanner off", "Always scan", "Always scan periodic report", "Periodic scan immediate report", "Periodic scan periodic report"];
var pirDelayRespStatusArray = ["Low delay", "Medium delay", "High delay", "All type"];
var pirDoorStatusArray = ["Close", "Open", "All type"];
var pirSensorSensitivityArray = ["Low sensitivity", "Medium sensitivity", "High sensitivity", "All type"];
var pirSensorDetactionStatusArray = ["No effective motion detected", "Effective motion detected", "All type"];
var otherRelationArray = ["A", "A&B", "A|B", "A&B&C", "(A&B)|C", "A|B|C"];
var filterDuplicateDataRuleArray = ["None", "MAC", "MAC+Data type", "MAC+RAW Data"];
var fixModeArray = ["OFF", "Periodic fix", "Motion fix"];
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
        if (data.flag == '2003') {
            // Device info
            return parseDevInfo(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '3004') {
            // Device status
            return parseDevStatus(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '3006') {
            // OTA result
            return parseOTAResult(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2007') {
            // NTP Settings
            return parseNTPSettings(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2008') {
            // Time
            return parseTime(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2009') {
            // Commure timeout
            return parseCommureTimeout(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '200a') {
            // Indicator
            return parseIndicator(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '200b') {
            // Cert or OTA status
            return parseUpdateFileStatus(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '200c') {
            // Report settings
            return parseReportSettings(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '200d') {
            // Power off notification
            return parsePowerOffNotify(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '200e') {
            // Ble connect password
            return parseBleConnectPassword(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '200f') {
            // Password verify
            return parsePasswordVerify(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '3010') {
            // Power off alarm
            return parsePowerOffAlarm(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '3011') {
            // Low power alarm
            return parseLowPowerAlarm(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2012') {
            // Low power settings
            return parseLowPower(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2013') {
            // Battery voltage
            return parseBattery(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '3014') {
            // Button reset notify
        } else if (data.flag == '2015') {
            // Power on enable when charging
            return parsePowerOn(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2020') {
            // Network settings
            return parseNetworkSettigs(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2021') {
            // Connect timeout
            return parseConnTimeout(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2030') {
            // MQTT settings
            return parseMqttSettings(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '3032') {
            // MQTT cert result
            return parseMqttCertResult(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2040') {
            // Scanner report mode
            return parseScannerReportMode(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2041') {
            // Always scan
            return parseAlwaysScan(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2042') {
            // Periodic Scan Immediate Report
            return parsePeriodicScanImmediateReport(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2043') {
            // Periodic Scan Periodic Report
            return parsePeriodicScanPeriodicReport(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2050') {
            // Filter relationship
            return parseFilterRelationship(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2051') {
            // Filter rssi
            return parseFilterRssi(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2052') {
            // Filter phy
            return parseFilterPhy(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2053') {
            // Filter mac
            return parseFilterMac(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2054') {
            // Filter name
            return parseFilterName(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2055') {
            // Filter rawdata
            return parseFilterRawdata(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2056') {
            // Filter ibeacon
            return parseFilterIbeacon(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2057') {
            // Filter eddystone_uid
            return parseFilterEddystoneUID(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2058') {
            // Filter eddystone_url
            return parseFilterEddystoneURL(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2059') {
            // Filter eddystone_tlm
            return parseFilterEddystoneTLM(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '205a') {
            // Filter bxp-devinfo
            return parseFilterBXPDeviceInfo(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '205b') {
            // Filter bxp-acc
            return parseFilterBXPACC(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '205c') {
            // Filter bxp-th
            return parseFilterBXPTH(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '205d') {
            // Filter bxp-button
            return parseFilterBXPButton(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '205e') {
            // Filter bxp-tag
            return parseFilterBXPTag(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '205f') {
            // Filter pir
            return parseFilterPIR(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2060') {
            // Filter tof
            return parseFilterTOF(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2061') {
            // Filter other
            return parseFilterOther(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2062') {
            // Filter Duplicate data
            return parseFilterDuplicateData(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2070') {
            // Adv settings
            return parseAdvSettings(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2071') {
            // Ibeacon settings
            return parseIbeaconSettings(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2080') {
            // Fix mode
            return parseFixMode(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2081') {
            // Fix interval
            return parsePeriodicFix(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2082') {
            // 3-Axis params
            return parseAxisParams(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2083') {
            // Motion start params
            return parseMotionStartParams(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2084') {
            // Motion in trip params
            return parseMotionInTripParams(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2085') {
            // Motion stop params
            return parseMotionStopParams(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2086') {
            // Stationary params
            return parseStationaryParams(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2087') {
            // GPS params
            return parseGPSParams(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2090') {
            // Ibeacon payload
            return parseIbeaconPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2091') {
            // EddystoneUID payload
            return parseEddystoneUIDPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2092') {
            // EddystoneURL payload
            return parseEddystoneURLPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2093') {
            // EddystoneTLM payload
            return parseEddystoneTLMPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2094') {
            // bxp-devinfo payload
            return parseBXPDevInfoPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2095') {
            // bxp-acc payload
            return parseBXPAccPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2096') {
            // bxp-th payload
            return parseBXPTHPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2097') {
            // bxp-button payload
            return parseBXPButtonPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2098') {
            // bxp-tag payload
            return parseBXPTagPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '2099') {
            // pir payload
            return parsePIRPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '209a') {
            // tof payload
            return parseTOFPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '209b') {
            // other payload
            return parseOtherPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '3089' || data.flag == '30b1') {
            // Fix data
            return parseFixData(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        } else if (data.flag == '30a0' || data.flag == '30b2') {
            // Scan devices
            return parseScanDevices(deviceDataIndex, deviceDataLength, deviceDataArray, data);
        }
    }
    return value;
}


function parseDevInfo(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var deviceInfo = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            deviceInfo.deviceName = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 1) {
            deviceInfo.productModel = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 2) {
            deviceInfo.companyName = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 3) {
            deviceInfo.hardwareVersion = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 4) {
            deviceInfo.softwareVersion = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 5) {
            deviceInfo.firmwareVersion = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 6) {
            deviceInfo.imei = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 7) {
            deviceInfo.iccid = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.deviceInfo = deviceInfo;
    return JSON.stringify(data);
}

function parseDevStatus(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var deviceStatus = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            deviceStatus.timestamp = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 1) {
            deviceStatus.netwrokType = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 2) {
            deviceStatus.csq = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 3) {
            deviceStatus.battVoltage = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) + "mV";
        } else if (paramTag == 4) {
            var axis_data_array = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength);
            deviceStatus.axisDataX = axis_data_array.slice(0, 2).join("") + "mg";
            deviceStatus.axisDataY = axis_data_array.slice(2, 4).join("") + "mg";
            deviceStatus.axisDataZ = axis_data_array.slice(4, 6).join("") + "mg";
        } else if (paramTag == 5) {
            deviceStatus.accStatus = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 6) {
            deviceStatus.imei = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.deviceStatus = deviceStatus;
    return JSON.stringify(data);
}

function parseOTAResult(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var otaResult = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            // -1:in ota,0:failure,1:success
            otaResult.result = signedHexToInt(deviceDataArray[deviceDataIndex]);
        }
    }
    data.otaResult = otaResult;
    return JSON.stringify(data);
}

function parseNTPSettings(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var ntp = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            ntp.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            ntp.host = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 2) {
            ntp.interval = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        }
        deviceDataIndex += paramLength;
    }
    data.ntp = ntp;
    return JSON.stringify(data);
}

function parseTime(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var currentTime = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            currentTime.timestamp = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 1) {
            currentTime.timezone = parseInt(deviceDataArray[deviceDataIndex], 16);
            currentTime.timeStr = parse_time(currentTime.timestamp, currentTime.timezone);
        }
        deviceDataIndex += paramLength;
    }
    data.currentTime = currentTime;
    return JSON.stringify(data);
}

function parseCommureTimeout(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var commureTimeout = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            commureTimeout.timeout = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.commureTimeout = commureTimeout;
    return JSON.stringify(data);
}

function parseIndicator(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var indicator = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            indicator.power = parseInt(deviceDataArray[deviceDataIndex], 16) & 0x01;
            indicator.switch = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 1) & 0x01;
            indicator.network = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 2) & 0x01;
            indicator.gps = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 3) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.indicator = indicator;
    return JSON.stringify(data);
}

function parseUpdateFileStatus(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var updateStatus = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            updateStatus.updateStatus = parseInt(deviceDataArray[deviceDataIndex], 16) == 1 ? "Updating" : "No updating";
        }
        deviceDataIndex += paramLength;
    }
    data.updateStatus = updateStatus;
    return JSON.stringify(data);
}

function parseReportSettings(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var reportSettings = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            reportSettings.interval = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 1) {
            reportSettings.battVoltage = parseInt(deviceDataArray[deviceDataIndex], 16) & 0x01;
            reportSettings.axisData = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 1) & 0x01;
            reportSettings.accStatus = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 2) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.reportSettings = reportSettings;
    return JSON.stringify(data);
}

function parsePowerOffNotify(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var powerOffNotify = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            powerOffNotify.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.powerOffNotify = powerOffNotify;
    return JSON.stringify(data);
}

function parseBleConnectPassword(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var blePassword = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            blePassword.password = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.blePassword = blePassword;
    return JSON.stringify(data);
}

function parsePasswordVerify(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var passwordVerify = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            passwordVerify.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.passwordVerify = passwordVerify;
    return JSON.stringify(data);
}

function parsePowerOffAlarm(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var powerOffAlarm = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            powerOffAlarm.timestamp = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
            powerOffAlarm.timeStr = parse_time(powerOffAlarm.timestamp, 0);
        } else if (paramTag == 1) {
            lowPowerAlarm.battVoltage = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) + "mV";
        }
        deviceDataIndex += paramLength;
    }
    data.powerOffAlarm = powerOffAlarm;
    return JSON.stringify(data);
}

function parseLowPowerAlarm(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var lowPowerAlarm = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            lowPowerAlarm.timestamp = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
            lowPowerAlarm.timeStr = parse_time(lowPowerAlarm.timestamp, 0);
        } else if (paramTag == 1) {
            lowPowerAlarm.battVoltage = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) + "mV";
        }
        deviceDataIndex += paramLength;
    }
    data.lowPowerAlarm = lowPowerAlarm;
    return JSON.stringify(data);
}

function parseLowPower(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var lowPower = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            lowPower.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            lowPower.percentage = lowPowerArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
        }
        deviceDataIndex += paramLength;
    }
    data.lowPower = lowPower;
    return JSON.stringify(data);
}

function parseBattery(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var battery = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            battery.voltage = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) + "mV";
        }
        deviceDataIndex += paramLength;
    }
    data.battery = battery;
    return JSON.stringify(data);
}

function parsePowerOn(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var powerOn = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            powerOn.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.powerOn = powerOn;
    return JSON.stringify(data);
}

function parseNetworkSettigs(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var networkSettings = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            networkSettings.priority = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            networkSettings.apn = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 2) {
            networkSettings.apnUsername = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 3) {
            networkSettings.apnPassword = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.networkSettings = networkSettings;
    return JSON.stringify(data);
}

function parseConnTimeout(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var connect = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            connect.timeout = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.connect = connect;
    return JSON.stringify(data);
}

function parseMqttSettings(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var mqttSettings = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            mqttSettings.sslMode = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            mqttSettings.host = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 2) {
            mqttSettings.port = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 3) {
            mqttSettings.clientId = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 4) {
            mqttSettings.username = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 5) {
            mqttSettings.password = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 6) {
            mqttSettings.subscribeTopic = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 7) {
            mqttSettings.publishTopic = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 8) {
            mqttSettings.qos = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 9) {
            mqttSettings.cleanSession = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 10) {
            mqttSettings.keepAlive = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.mqttSettings = mqttSettings;
    return JSON.stringify(data);
}

function parseMqttCert(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var mqttCert = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            mqttCert.caUrl = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 1) {
            mqttCert.clientCertUrl = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 2) {
            mqttCert.clientKeyUrl = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.mqttCert = mqttCert;
    return JSON.stringify(data);
}

function parseMqttCertResult(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var mqttCertResult = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            // -1:in ota,0:failure,1:success
            mqttCertResult.otaResult = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.mqttCertResult = mqttCertResult;
    return JSON.stringify(data);
}

function parseScannerReportMode(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var scannerReportMode = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            scannerReportMode.mode = scannerReportArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
        } else if (paramTag == 1) {
            scannerReportMode.autoSwtich = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.scannerReportMode = scannerReportMode;
    return JSON.stringify(data);
}

function parseAlwaysScan(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var alwaysScan = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            alwaysScan.interval = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.alwaysScan = alwaysScan;
    return JSON.stringify(data);
}

function parsePeriodicScanImmediateReport(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var periodicScanImmediateReport = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            periodicScanImmediateReport.duration = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 1) {
            periodicScanImmediateReport.interval = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.periodicScanImmediateReport = periodicScanImmediateReport;
    return JSON.stringify(data);
}

function parsePeriodicScanPeriodicReport(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var periodicScanPeriodicReport = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            periodicScanPeriodicReport.duration = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 1) {
            periodicScanPeriodicReport.interval = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 2) {
            periodicScanPeriodicReport.reportInterval = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 3) {
            periodicScanPeriodicReport.dataRetentionPriority = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.periodicScanPeriodicReport = periodicScanPeriodicReport;
    return JSON.stringify(data);
}

function parseFilterRelationship(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filter = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filter.relation = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.filter = filter;
    return JSON.stringify(data);
}

function parseFilterRssi(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filter = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filter.rssi = signedHexToInt(deviceDataArray[deviceDataIndex]);
        }
        deviceDataIndex += paramLength;
    }
    data.filter = filter;
    return JSON.stringify(data);
}

function parseFilterPhy(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filter = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filter.phy = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.filter = filter;
    return JSON.stringify(data);
}

function parseFilterMac(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterMac = {};
    var array = [];
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterMac.precise = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            filterMac.reverse = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 2) {
            var mac = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
            array.push(mac);
        }
        deviceDataIndex += paramLength;
    }
    filterMac.array = array
    data.filterMac = filterMac;
    return JSON.stringify(data);
}

function parseFilterName(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterName = {};
    var array = [];
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterName.precise = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            filterName.reverse = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 2) {
            var mac = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
            array.push(mac);
        }
        deviceDataIndex += paramLength;
    }
    filterName.array = array
    data.filterName = filterName;
    return JSON.stringify(data);
}

function parseFilterRawdata(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterRawdata = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterRawdata.ibeacon = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            filterRawdata.eddystoneUID = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            filterRawdata.eddystoneURL = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            filterRawdata.eddystoneTLM = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
            filterRawdata.bxpDeviceInfo = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & 0x01;
            filterRawdata.bxpAcc = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 5) & 0x01;
            filterRawdata.bxpTH = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 6) & 0x01;
            filterRawdata.bxpButton = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 7) & 0x01;
            filterRawdata.bxpTag = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 8) & 0x01;
            filterRawdata.pir = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 9) & 0x01;
            filterRawdata.tof = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 10) & 0x01;
            filterRawdata.other = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 11) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.filterRawdata = filterRawdata;
    return JSON.stringify(data);
}

function parseFilterIbeacon(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterIbeacon = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterIbeacon.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            filterIbeacon.minMajor = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 2) {
            filterIbeacon.maxMajor = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 3) {
            filterIbeacon.minMinor = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 4) {
            filterIbeacon.maxMinor = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 5) {
            filterIbeacon.uuid = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
        }
        deviceDataIndex += paramLength;
    }
    data.filterIbeacon = filterIbeacon;
    return JSON.stringify(data);
}

function parseFilterEddystoneUID(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterEddystoneUID = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterEddystoneUID.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            filterEddystoneUID.namespace = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
        } else if (paramTag == 2) {
            filterEddystoneUID.instance = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
        }
        deviceDataIndex += paramLength;
    }
    data.filterEddystoneUID = filterEddystoneUID;
    return JSON.stringify(data);
}

function parseFilterEddystoneURL(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterEddystoneURL = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterEddystoneURL.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            filterEddystoneURL.url = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.filterEddystoneURL = filterEddystoneURL;
    return JSON.stringify(data);
}

function parseFilterEddystoneTLM(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterEddystoneTLM = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterEddystoneTLM.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            filterEddystoneTLM.tlmVersion = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.filterEddystoneTLM = filterEddystoneTLM;
    return JSON.stringify(data);
}

function parseFilterBXPDeviceInfo(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterBXPDeviceInfo = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterBXPDeviceInfo.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.filterBXPDeviceInfo = filterBXPDeviceInfo;
    return JSON.stringify(data);
}

function parseFilterBXPACC(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterBXPACC = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterBXPACC.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.filterBXPACC = filterBXPACC;
    return JSON.stringify(data);
}

function parseFilterBXPTH(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterBXPTH = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterBXPTH.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.filterBXPTH = filterBXPTH;
    return JSON.stringify(data);
}

function parseFilterBXPButton(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterBXPButton = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterBXPButton.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            filterBXPButton.singlePress = parseInt(deviceDataArray[deviceDataIndex], 16) & 0x01;
            filterBXPButton.doublePress = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 1) & 0x01;
            filterBXPButton.longPress = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 2) & 0x01;
            filterBXPButton.abnormalInactivity = (parseInt(deviceDataArray[deviceDataIndex], 16) >> 3) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.filterBXPButton = filterBXPButton;
    return JSON.stringify(data);
}

function parseFilterBXPTag(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterBXPTag = {};
    var array = [];
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterBXPTag.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            filterBXPTag.precise = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 2) {
            filterBXPTag.reverse = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 3) {
            var tagId = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
            array.push(tagId);
        }
        deviceDataIndex += paramLength;
    }
    filterBXPTag.array = array
    data.filterBXPTag = filterBXPTag;
    return JSON.stringify(data);
}

function parseFilterPIR(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterPIR = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterPIR.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            filterPIR.delayRespStatus = pirDelayRespStatusArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
        } else if (paramTag == 2) {
            filterPIR.doorStatus = pirDoorStatusArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
        } else if (paramTag == 3) {
            filterPIR.sensorSensitivity = pirSensorSensitivityArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
        } else if (paramTag == 4) {
            filterPIR.sensorDetectionStatus = pirSensorDetactionStatusArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
        } else if (paramTag == 5) {
            filterPIR.minMajor = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 6) {
            filterPIR.maxMajor = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 7) {
            filterPIR.minMinor = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 8) {
            filterPIR.maxMinor = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.filterPIR = filterPIR;
    return JSON.stringify(data);
}

function parseFilterTOF(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterTOF = {};
    var array = [];
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterTOF.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            var code = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
            array.push(code);
        }
        deviceDataIndex += paramLength;
    }
    filterTOF.array = array
    data.filterTOF = filterTOF;
    return JSON.stringify(data);
}

function parseFilterOther(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterOther = {};
    var array = [];
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterOther.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            filterOther.relation = otherRelationArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
        } else if (paramTag == 2) {
            var item = {};
            item.type = deviceDataArray[deviceDataIndex];
            item.start = parseInt(deviceDataArray[deviceDataIndex + 1], 16);
            item.end = parseInt(deviceDataArray[deviceDataIndex + 2], 16);
            item.data = deviceDataArray.slice(deviceDataIndex + 3, deviceDataIndex + paramLength).join("");
            array.push(item);
        }
        deviceDataIndex += paramLength;
    }
    filterOther.array = array;
    data.filterOther = filterOther;
    return JSON.stringify(data);
}

function parseFilterDuplicateData(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var filterDuplicate = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            filterDuplicate.rule = filterDuplicateDataRuleArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
        }
        deviceDataIndex += paramLength;
    }
    data.filterDuplicate = filterDuplicate;
    return JSON.stringify(data);
}

function parseAdvSettings(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var advSettings = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            advSettings.respEnable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            advSettings.advName = hexStrToString(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 2) {
            advSettings.advInterval = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 3) {
            advSettings.txPower = signedHexToInt(deviceDataArray[deviceDataIndex]);
        } else if (paramTag == 4) {
            advSettings.advTimeout = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.advSettings = advSettings;
    return JSON.stringify(data);
}

function parseIbeaconSettings(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var ibeaconSettings = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            ibeaconSettings.major = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 1) {
            ibeaconSettings.minor = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 2) {
            ibeaconSettings.uuid = deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("");
        } else if (paramTag == 3) {
            ibeaconSettings.rssi_1m = signedHexToInt(deviceDataArray[deviceDataIndex]);
        }
        deviceDataIndex += paramLength;
    }
    data.ibeaconSettings = ibeaconSettings;
    return JSON.stringify(data);
}

function parseFixMode(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var fixMode = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            fixMode.mode = fixModeArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
        }
        deviceDataIndex += paramLength;
    }
    data.fixMode = fixMode;
    return JSON.stringify(data);
}

function parsePeriodicFix(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var periodicFix = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            periodicFix.advInterval = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.periodicFix = periodicFix;
    return JSON.stringify(data);
}

function parseAxisParams(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var axisParams = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            axisParams.wakeupThreshold = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 1) {
            axisParams.wakeupDuration = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 2) {
            axisParams.motionThreshold = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 3) {
            axisParams.motionDuration = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.axisParams = axisParams;
    return JSON.stringify(data);
}

function parseMotionStartParams(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var motionStartParams = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            motionStartParams.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.motionStartParams = motionStartParams;
    return JSON.stringify(data);
}

function parseMotionInTripParams(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var motionInTripParams = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            motionInTripParams.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            motionInTripParams.interval = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.motionInTripParams = motionInTripParams;
    return JSON.stringify(data);
}

function parseMotionStopParams(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var motionStopParams = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            motionStopParams.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            motionStopParams.timeout = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.motionStopParams = motionStopParams;
    return JSON.stringify(data);
}

function parseStationaryParams(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var stationaryParams = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            stationaryParams.enable = parseInt(deviceDataArray[deviceDataIndex], 16);
        } else if (paramTag == 1) {
            stationaryParams.interval = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        }
        deviceDataIndex += paramLength;
    }
    data.stationaryParams = stationaryParams;
    return JSON.stringify(data);
}

function parseGPSParams(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var gpsParams = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            gpsParams.timeout = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
        } else if (paramTag == 1) {
            gpsParams.pdop = parseInt(deviceDataArray[deviceDataIndex], 16);
        }
        deviceDataIndex += paramLength;
    }
    data.gpsParams = gpsParams;
    return JSON.stringify(data);
}

function parseIbeaconPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var ibeaconPayload = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            ibeaconPayload.rssi = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            ibeaconPayload.timestamp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            ibeaconPayload.uuid = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            ibeaconPayload.major = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
            ibeaconPayload.minor = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & 0x01;
            ibeaconPayload.rssi_1m = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 5) & 0x01;
            ibeaconPayload.rawAdv = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 6) & 0x01;
            ibeaconPayload.rawResp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 7) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.ibeaconPayload = ibeaconPayload;
    return JSON.stringify(data);
}

function parseEddystoneUIDPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var eddystoneUIDPayload = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            eddystoneUIDPayload.rssi = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            eddystoneUIDPayload.timestamp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            eddystoneUIDPayload.rssi_0m = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            eddystoneUIDPayload.namespace = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
            eddystoneUIDPayload.instance = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & 0x01;
            eddystoneUIDPayload.rawAdv = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 5) & 0x01;
            eddystoneUIDPayload.rawResp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 6) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.eddystoneUIDPayload = eddystoneUIDPayload;
    return JSON.stringify(data);
}

function parseEddystoneURLPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var eddystoneURLPayload = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            eddystoneURLPayload.rssi = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            eddystoneURLPayload.timestamp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            eddystoneURLPayload.rssi_0m = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            eddystoneURLPayload.url = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
            eddystoneURLPayload.rawAdv = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & 0x01;
            eddystoneURLPayload.rawResp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 5) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.eddystoneURLPayload = eddystoneURLPayload;
    return JSON.stringify(data);
}

function parseEddystoneTLMPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var eddystoneTLMPayload = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            eddystoneTLMPayload.rssi = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            eddystoneTLMPayload.timestamp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            eddystoneTLMPayload.tlmVersion = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            eddystoneTLMPayload.battVoltage = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
            eddystoneTLMPayload.temperature = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & 0x01;
            eddystoneTLMPayload.advCnt = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 5) & 0x01;
            eddystoneTLMPayload.secCnt = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 6) & 0x01;
            eddystoneTLMPayload.rawAdv = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 7) & 0x01;
            eddystoneTLMPayload.rawResp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 8) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.eddystoneTLMPayload = eddystoneTLMPayload;
    return JSON.stringify(data);
}

function parseBXPDevInfoPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var bxpDevInfoPayload = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            bxpDevInfoPayload.rssi = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            bxpDevInfoPayload.timestamp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            bxpDevInfoPayload.txPower = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            bxpDevInfoPayload.rangingData = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
            bxpDevInfoPayload.advInterval = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & 0x01;
            bxpDevInfoPayload.battVoltage = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 5) & 0x01;
            bxpDevInfoPayload.devicePropertyIndicator = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 6) & 0x01;
            bxpDevInfoPayload.switchStatusIndicator = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 7) & 0x01;
            bxpDevInfoPayload.firmwareVersion = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 8) & 0x01;
            bxpDevInfoPayload.deviceName = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 9) & 0x01;
            bxpDevInfoPayload.rawAdv = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 10) & 0x01;
            bxpDevInfoPayload.rawResp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 11) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.bxpDevInfoPayload = bxpDevInfoPayload;
    return JSON.stringify(data);
}

function parseBXPAccPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var bxpAccPayload = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            bxpAccPayload.rssi = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            bxpAccPayload.timestamp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            bxpAccPayload.txPower = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            bxpAccPayload.rangingData = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
            bxpAccPayload.advInterval = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & 0x01;
            bxpAccPayload.samplingRate = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 5) & 0x01;
            bxpAccPayload.fullScale = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 6) & 0x01;
            bxpAccPayload.motionThreshold = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 7) & 0x01;
            bxpAccPayload.axisData = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 8) & 0x01;
            bxpAccPayload.battVoltage = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 9) & 0x01;
            bxpAccPayload.rawAdv = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 10) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.bxpAccPayload = bxpAccPayload;
    return JSON.stringify(data);
}

function parseBXPTHPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var bxpTHPayload = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            bxpTHPayload.rssi = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            bxpTHPayload.timestamp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            bxpTHPayload.txPower = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            bxpTHPayload.rangingData = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
            bxpTHPayload.advInterval = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & 0x01;
            bxpTHPayload.temperature = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 5) & 0x01;
            bxpTHPayload.humidity = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 6) & 0x01;
            bxpTHPayload.battVoltage = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 7) & 0x01;
            bxpTHPayload.rawAdv = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 8) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.bxpTHPayload = bxpTHPayload;
    return JSON.stringify(data);
}

function parseBXPButtonPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var bxpButtonPayload = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            bxpButtonPayload.rssi = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            bxpButtonPayload.timestamp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            bxpButtonPayload.frameType = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            bxpButtonPayload.statusFlag = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
            bxpButtonPayload.triggerCount = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & 0x01;
            bxpButtonPayload.deviceId = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 5) & 0x01;
            bxpButtonPayload.firmwareType = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 6) & 0x01;
            bxpButtonPayload.deviceName = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 7) & 0x01;
            bxpButtonPayload.fullScale = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 8) & 0x01;
            bxpButtonPayload.motionThreshold = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 9) & 0x01;
            bxpButtonPayload.axisData = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 10) & 0x01;
            bxpButtonPayload.temperature = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 11) & 0x01;
            bxpButtonPayload.rangingData = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 12) & 0x01;
            bxpButtonPayload.battVoltage = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 13) & 0x01;
            bxpButtonPayload.txPower = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 14) & 0x01;
            bxpButtonPayload.rawAdv = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 15) & 0x01;
            bxpButtonPayload.rawResp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 16) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.bxpButtonPayload = bxpButtonPayload;
    return JSON.stringify(data);
}

function parseBXPTagPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var bxpTagPayload = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            bxpTagPayload.rssi = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            bxpTagPayload.timestamp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            bxpTagPayload.sensorData = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            bxpTagPayload.hallTriggerEventCount = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
            bxpTagPayload.motionTriggerEventCount = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & 0x01;
            bxpTagPayload.axisData = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 5) & 0x01;
            bxpTagPayload.battVoltage = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 6) & 0x01;
            bxpTagPayload.tagId = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 7) & 0x01;
            bxpTagPayload.deviceName = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 8) & 0x01;
            bxpTagPayload.rawAdv = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 9) & 0x01;
            bxpTagPayload.rawResp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 10) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.bxpTagPayload = bxpTagPayload;
    return JSON.stringify(data);
}

function parsePIRPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var pirPayload = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            pirPayload.rssi = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            pirPayload.timestamp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            pirPayload.pirDelayResponseStatus = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            pirPayload.doorStatus = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
            pirPayload.sensorSensitivity = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & 0x01;
            pirPayload.sensorDetectionStatus = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 5) & 0x01;
            pirPayload.battVoltage = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 6) & 0x01;
            pirPayload.major = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 7) & 0x01;
            pirPayload.minor = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 8) & 0x01;
            pirPayload.rssi_1m = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 9) & 0x01;
            pirPayload.txPower = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 10) & 0x01;
            pirPayload.advName = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 11) & 0x01;
            pirPayload.rawAdv = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 12) & 0x01;
            pirPayload.rawResp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 13) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.pirPayload = pirPayload;
    return JSON.stringify(data);
}

function parseTOFPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var tofPayload = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            tofPayload.rssi = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            tofPayload.timestamp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            tofPayload.manufacturerVendorCode = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            tofPayload.battVoltage = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
            tofPayload.userData = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 4) & 0x01;
            tofPayload.randingDistance = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 5) & 0x01;
            tofPayload.rawAdv = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 6) & 0x01;
            tofPayload.rawResp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 7) & 0x01;
        }
        deviceDataIndex += paramLength;
    }
    data.tofPayload = tofPayload;
    return JSON.stringify(data);
}

function parseOtherPayload(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var otherPayload = {};
    var array = [];
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            otherPayload.rssi = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0x01;
            otherPayload.timestamp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 1) & 0x01;
            otherPayload.rawAdv = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 2) & 0x01;
            otherPayload.rawResp = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 3) & 0x01;
        } else if (paramTag == 1) {
            var item = {};
            item.type = deviceDataArray[deviceDataIndex];
            item.start = parseInt(deviceDataArray[deviceDataIndex + 1], 16);
            item.end = parseInt(deviceDataArray[deviceDataIndex + 2], 16);
            item.data = deviceDataArray.slice(deviceDataIndex + 3, deviceDataIndex + paramLength).join("");
            array.push(item);
        }
        deviceDataIndex += paramLength;
    }
    otherPayload.array = array
    data.otherPayload = otherPayload;
    return JSON.stringify(data);
}

// =======================
function parseFixData(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var fixData = {};
    for (; deviceDataIndex < deviceDataLength;) {
        var paramTag = parseInt(deviceDataArray[deviceDataIndex], 16);
        deviceDataIndex++;
        var paramLength = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 2));
        deviceDataIndex += 2;
        if (paramTag == 0) {
            fixData.timestamp = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength));
            fixData.current_time = parse_time(fixData.timestamp, 0);
        } else if (paramTag == 1) {
            fixData.fixMode = fixModeNotifyArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
        } else if (paramTag == 2) {
            fixData.fixResult = fixResultArray[parseInt(deviceDataArray[deviceDataIndex], 16)];
        } else if (paramTag == 3) {
            fixData.longitude = Number(signedHexToInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength - 4).join("")) * 0.0000001).toFixed(7);
            fixData.latitude = Number(signedHexToInt(deviceDataArray.slice(deviceDataIndex + 4, deviceDataIndex + paramLength).join("")) * 0.0000001).toFixed(7);
        } else if (paramTag == 4) {
            fixData.tac_lac = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) & 0xFFFF;
            fixData.ci = (parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength)) >> 16) & 0xFFFFFFFF;
        } else if (paramTag == 5) {
            fixData.hdop = Number(parseInt(deviceDataArray[deviceDataIndex], 16) * 0.1).toFixed(1);
        }
        deviceDataIndex += paramLength;
    }
    data.fixData = fixData;
    return JSON.stringify(data);
}

function parseScanDevices(deviceDataIndex, deviceDataLength, deviceDataArray, data) {
    var deviceArray = [];
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
        } else if (paramTag == 0xA0) {
            // max_rssi
            deviceDataIndex += 2;
            deviceItem.max_rssi = parseInt(deviceDataArray[deviceDataIndex], 16) - 256;
            deviceDataIndex++;
        } else if (paramTag == 0xA1) {
            // min_rssi
            deviceDataIndex += 2;
            deviceItem.min_rssi = parseInt(deviceDataArray[deviceDataIndex], 16) - 256;
            deviceDataIndex++;
        } else if (paramTag == 0xA2) {
            // avg_rssi
            deviceDataIndex += 2;
            deviceItem.avg_rssi = parseInt(deviceDataArray[deviceDataIndex], 16) - 256;
            deviceDataIndex++;
        } else if (paramTag == 0xA3) {
            // scan_num
            deviceDataIndex += 2;
            deviceItem.scan_num = parseHexStrArraytoInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + 4));
            deviceDataIndex += 4;
        } else if (paramTag >= 0x0A && paramTag < 0xA0) {
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

// =======================
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

function parseEddystoneUID(deviceItem, paramTag, deviceDataArray, deviceDataIndex, paramLength) {
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
        deviceItem.temperature = Number(signedHexToInt(deviceDataArray.slice(deviceDataIndex, deviceDataIndex + paramLength).join("")) / 256).toFixed(1) + "℃";
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
        deviceItem.doorStatus = parseInt(deviceDataArray[deviceDataIndex], 16) == 0 ? "close" : "open";
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
    twoStr = -parseInt(twoStr_unsign, 2);
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

// function getData(hex) {
// 	var length = hex.length;
// 	var datas = [];
// 	for (var i = 0; i < length; i += 2) {
// 		var start = i;
// 		var end = i + 2;
// 		var data = parseInt("0x" + hex.substring(start, end));
// 		datas.push(data);
// 	}
// 	return datas;
// }

// var bytes = "ef30 a0d9 1e5d 4026 6302 a800 0001 0601 0006 e1ce 642c 70b9 0200 0101 0300 0567 089a 9c00 0400 01bb 0a00 01fc 0b00 01e5 0c00 010a 0d00 0201 0b0e 0002 0224 0f00 020c 0e00 0001 0201 0006 e1ce 642c 70b9 0200 0101 0300 0567 089a 9c00 0400 01b9 0a00 1668 7474 7073 3a2f 2f77 7777 2e67 6f6f 676c 652e 636f 6d0b 0001 0000 0001 0101 0006 e1ce 642c 70b9 0200 0101 0300 0567 089a 9c00 0400 01bd 0b00 0100 0a00 0a11 1122 2233 3344 4455 550c 0006 1212 1212 1212 0000 0106 0100 06e1 ce64 2c70 b902 0001 0103 0005 6708 9a9d 0004 0001 b60a 0001 fc0b 0001 e50c 0001 0a0d 0002 010a 0e00 0202 270f 0002 0c0e 0000 0102 0100 06e1 ce64 2c70 b902 0001 0103 0005 6708 9a9e 0004 0001 be0a 0016 6874 7470 733a 2f2f 7777 772e 676f 6f67 6c65 2e63 6f6d 0b00 0100 0000 0106 0100 06e1 ce64 2c70 b902 0001 0103 0005 6708 9a9f 0004 0001 b90a 0001 fc0b 0001 e50c 0001 0a0d 0002 010a 0e00 0202 290f 0002 0c0e 0000 0101 0100 06e1 ce64 2c70 b902 0001 0103 0005 6708 9a9f 0004 0001 bd0b 0001 000a 000a 1111 2222 3333 4444 5555 0c00 0612 1212 1212 1200 0001 0601 0006 e1ce 642c 70b9 0200 0101 0300 0567 089a a000 0400 01b9 0a00 01fc 0b00 01e5 0c00 010a 0d00 0201 0a0e 0002 022b 0f00 020c 0e00 0001 0201 0006 e1ce 642c 70b9 0200 0101 0300 0567 089a a200 0400 01b7 0a00 1668 7474 7073 3a2f 2f77 7777 2e67 6f6f 676c 652e 636f 6d0b 0001 0000 0001 0001 0006 e1ce 642c 70b9 0200 0101 0400 01b8 0500 1e02 0106 1aff 4c00 0215 1111 2222 3333 4444 5555 6666 6666 6666 000a 0014 c50b 0002 000a 0000 0106 0100 06e1 ce64 2c70 b902 0001 0103 0005 6708 9aa3 0004 0001 b50a 0001 fc0b 0001 e50c 0001 0a0d 0002 010b 0e00 0202 2c0f 0002 0c0e 0000 0103 0100 06e1 ce64 2c70 b902 0001 0103 0005 6708 9aa4 0004 0001 be0a 0001 000b 0002 0c0e 0c00 0218 400d 0004 0001 423b 0e00 0400 0284 68";
// console.log(handlePayload(bytes,0,0));