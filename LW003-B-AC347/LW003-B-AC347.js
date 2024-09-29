var heartbeatArray = ["Heartbeat", "Low power", "ble downlink connect", "downlink payload"];
var shutdownModeArray = ["Ble cmd", "Lora downlink", "Long-press button", "Low power"];
var beaconAlarmStatusArray = ["No", "SOS(unconfirm ack state)", "SOS(confirm ack state)", "Self test", "Test"];
var keyStateArray = ["Initial", "Updated"];
var connectResultArray = ["Success", "Unconnectable", "Exceeds max connection", "Connected", "Exceed range", "Cannot connect", "Failed", "Type error", "Verify error"];
var disconnectReasonArray = ["Abnormal", "Timeout", "Active"];
var resultArray = ["Success", "Disconnected", "Commond invalid"];
var alarmStatusArray = ["No", "SOS(unconfirm ack state)", "SOS(confirm ack state)", "Self test"];
var batchUpdateResultArray = ["Exceed range", "Connect failed", "Verify failed", "Update failed"];
// Decode uplink function.
//
// Input is an object with the following fields:
// - bytes = Byte array containing the uplink payload, e.g. [255, 230, 255, 0]
// - fPort = Uplink fPort.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - data = Object representing the decoded payload.
function decodeUplink(input) {
    var bytes = input.bytes;
    var fPort = input.fPort;
    var dev_Info = {};
    var data = {};
    if (fPort == 0) {
        dev_Info.data = data;
        return dev_Info;
    }
    data.port = fPort;
    data.hex_format_payload = bytesToHexString(bytes, 0, bytes.length);
    // if (fPort == 1 || fPort == 2 || fPort == 3 || fPort == 4
    //     || fPort == 5 || fPort == 8 || fPort == 9) {
    //     data.charging_status = bytes[0] & 0x80 ? "charging" : "no charging";
    //     data.batt_level = (bytes[0] & 0x7F) + "%";
    // }
    if (fPort == 1) {
        // Heartbeat
        var firmware_ver_major = (bytes[0] >> 6) & 0x03;
        var firmware_ver_minor = (bytes[0] >> 4) & 0x03;
        var firmware_ver_patch = bytes[0] & 0x0f;
        data.firmware_version = "V" + firmware_ver_major + "." + firmware_ver_minor + "." + firmware_ver_patch;
        // var hardware_ver_major = (bytes[1] >> 4) & 0x0f;
        // var hardware_ver_patch = bytes[1] & 0x0f;
        // data.hardware_version = "V" + hardware_ver_major + "." + hardware_ver_patch;
        data.batt_v = bytesToInt(bytes, 1, 2) + "mV";
        data.heartbeat_reaon = heartbeatArray[bytes[3]];
    }
    else if (fPort == 2) {
        // Shutdown
        data.timestamp = bytesToInt(bytes, 0, 4);
        data.current_time = parse_time(data.timestamp);
        data.batt_v = bytesToInt(bytes, 4, 2) + "mV";
        data.shutdown_mode = shutdownModeArray[bytes[6]];
    }
    else if (fPort == 3) {
        // Scan data
        var datalen = bytes.length;
        var dev_array = [];
        for (var i = 0; i < datalen;) {
            var len = bytes[i++] & 0xff;
            // var dev_type = bytes[i++] & 0xff;
            // var data_len = bytes[i++] & 0xff;
            var raw_bytes = bytes.slice(i, i + len);
            var item = parseScanData(raw_bytes);
            // dev_array.push(JSON.stringify(item));
            dev_array.push(item);
            i += len;
        }
        data.dev_array = dev_array;
    }
    else if (fPort == 5) {
        // Battery consumption
        data.working_hours = bytesToInt(bytes, 0, 4);
        data.ble_adv_count = bytesToInt(bytes, 4, 4);
        data.ble_scan_time = bytesToInt(bytes, 8, 4);
        data.lorawan_send_times = bytesToInt(bytes, 12, 4);
        data.lorawan_send_receive_consumption = bytesToInt(bytes, 16, 4) + "mAS";
        data.battery_consumption = (bytesToInt(bytes, 20, 4) * 0.001) + "mAH";
    }
    // else if (fPort == 6) {
    //     // BLE Control
    //     var head = bytes[0];
    //     if (head == 0) {
    //         // read    
    //     }
    //     else if (head == 1) {
    //         // write
    //         data.result = bytes[1];
    //     }
    // }
    else if (fPort == 7) {
        // Params read/write/notify
        var cmd = bytesToInt(bytes, 0, 2);
        // var cmd_type = (cmd >> 12) & 0x0f;
        // var cmd_offset = cmd & 0x0fff
        data.cmd = bytesToHexString(bytes, 0, 2);
        var len = bytesToInt(bytes, 2, 1);
        if (len > 0) {
            var data_tlv = bytes.slice(3, 3 + len);
            // if (cmd_type == 1) {
            //     // write 
            //     if (len == 4) {
            //         // 1:success,0:false
            //         data.result = bytes[3];
            //     }
            // }
            // else if (cmd_type == 3) {
            //     // notify
            switch (cmd) {
                case 0x1100:
                case 0x1102:
                case 0x1103:
                case 0x1110:
                case 0x1112:
                case 0x1114:
                case 0x1115:
                case 0x1200:
                    data.result = bytes[3];
                    break;
                case 0x3101:
                    for (var i = 0; i < data_tlv.length;) {
                        var tlv_tag = data_tlv[i++] & 0xff;
                        var tlv_len = data_tlv[i++] & 0xff;
                        switch (tlv_tag) {
                            case 0x00:
                                data.mac = bytesToHexString(data_tlv, i, tlv_len);
                                break;
                            case 0x01:
                                data.result_code = bytesToInt(data_tlv, i, tlv_len);
                                data.result_msg = connectResultArray[data.result_code];
                                break;
                            case 0x02:
                                data.product_model = bytesToString(data_tlv, i, tlv_len)
                                break;
                            case 0x03:
                                data.company_name = bytesToString(data_tlv, i, tlv_len)
                                break;
                            case 0x04:
                                data.hardware_version = bytesToString(data_tlv, i, tlv_len)
                                break;
                            case 0x05:
                                data.software_version = bytesToString(data_tlv, i, tlv_len)
                                break;
                            case 0x06:
                                data.firmware_version = bytesToString(data_tlv, i, tlv_len)
                                break;
                            case 0x07:
                                data.battery_voltage = bytesToInt(data_tlv, i, tlv_len) + "mV";
                                break;
                        }
                        i += tlv_len;
                    }
                    break;
                case 0x3102:
                    var mac_array = [];
                    for (var i = 0; i < data_tlv.length;) {
                        var tlv_tag = data_tlv[i++] & 0xff;
                        var tlv_len = data_tlv[i++] & 0xff;
                        switch (tlv_tag) {
                            case 0x00:
                                var mac = bytesToHexString(data_tlv, i, tlv_len);
                                mac_array.push(mac);
                                break;
                            case 0x01:
                                data.result_code = bytesToInt(data_tlv, i, tlv_len);
                                data.result_msg = resultArray[data.result_code];
                        }
                        i += tlv_len;
                    }
                    data.mac_array = mac_array;
                    break;
                case 0x3104:
                    for (var i = 0; i < data_tlv.length;) {
                        var tlv_tag = data_tlv[i++] & 0xff;
                        var tlv_len = data_tlv[i++] & 0xff;
                        switch (tlv_tag) {
                            case 0x00:
                                data.mac = bytesToHexString(data_tlv, i, tlv_len);
                                break;
                            case 0x01:
                                data.reason_code = bytesToInt(data_tlv, i, tlv_len);
                                data.result_msg = disconnectReasonArray[data.reason_code];
                                break;
                        }
                        i += tlv_len;
                    }
                    break;
                case 0x3111:
                    for (var i = 0; i < data_tlv.length;) {
                        var tlv_tag = data_tlv[i++] & 0xff;
                        var tlv_len = data_tlv[i++] & 0xff;
                        switch (tlv_tag) {
                            case 0x00:
                                data.mac = bytesToHexString(data_tlv, i, tlv_len);
                                break;
                            case 0x01:
                                data.result_code = bytesToInt(data_tlv, i, tlv_len);
                                data.result_msg = resultArray[data.result_code];
                                break;
                            case 0x02:
                                data.product_model = bytesToString(data_tlv, i, tlv_len)
                                break;
                            case 0x03:
                                data.company_name = bytesToString(data_tlv, i, tlv_len)
                                break;
                            case 0x04:
                                data.hardware_version = bytesToString(data_tlv, i, tlv_len)
                                break;
                            case 0x05:
                                data.software_version = bytesToString(data_tlv, i, tlv_len)
                                break;
                            case 0x06:
                                data.firmware_version = bytesToString(data_tlv, i, tlv_len)
                                break;
                            case 0x07:
                                data.battery_voltage = bytesToInt(data_tlv, i, tlv_len) + "mV";
                                break;
                        }
                        i += tlv_len;
                    }
                    break;
                case 0x3113:
                    for (var i = 0; i < data_tlv.length;) {
                        var tlv_tag = data_tlv[i++] & 0xff;
                        var tlv_len = data_tlv[i++] & 0xff;
                        switch (tlv_tag) {
                            case 0x00:
                                data.mac = bytesToHexString(data_tlv, i, tlv_len);
                                break;
                            case 0x01:
                                data.result_code = bytesToInt(data_tlv, i, tlv_len);
                                data.result_msg = resultArray[data.result_code];
                                break;
                            case 0x02:
                                data.battery_voltage = bytesToInt(data_tlv, i, tlv_len) + "mV";
                                break;
                        }
                        i += tlv_len;
                    }
                    break;
                case 0x3115:
                    for (var i = 0; i < data_tlv.length;) {
                        var tlv_tag = data_tlv[i++] & 0xff;
                        var tlv_len = data_tlv[i++] & 0xff;
                        switch (tlv_tag) {
                            case 0x00:
                                data.mac = bytesToHexString(data_tlv, i, tlv_len);
                                break;
                            case 0x01:
                                data.result_code = bytesToInt(data_tlv, i, tlv_len);
                                data.result_msg = resultArray[data.result_code];
                                break;
                            case 0x02:
                                data.alarm_status_code = bytesToInt(data_tlv, i, tlv_len);
                                data.alarm_status = alarmStatusArray[data.alarm_status_code];
                                break;
                        }
                        i += tlv_len;
                    }
                    break;
                case 0x3117:
                    for (var i = 0; i < data_tlv.length;) {
                        var tlv_tag = data_tlv[i++] & 0xff;
                        var tlv_len = data_tlv[i++] & 0xff;
                        switch (tlv_tag) {
                            case 0x00:
                                data.mac = bytesToHexString(data_tlv, i, tlv_len);
                                break;
                            case 0x01:
                                data.result_code = bytesToInt(data_tlv, i, tlv_len);
                                data.result_msg = resultArray[data.result_code];
                                break;
                        }
                        i += tlv_len;
                    }
                    break;
                case 0x3201:
                    for (var i = 0; i < data_tlv.length;) {
                        var tlv_tag = data_tlv[i++] & 0xff;
                        var tlv_len = data_tlv[i++] & 0xff;
                        switch (tlv_tag) {
                            case 0x00:
                                data.mac = bytesToHexString(data_tlv, i, tlv_len);
                                break;
                            case 0x01:
                                data.result_code = bytesToInt(data_tlv, i, tlv_len);
                                data.result_msg = resultArray[data.result_code];
                                break;
                        }
                        i += tlv_len;
                    }
                    break;
                case 0x3202:
                    var mac_array = [];
                    for (var i = 0; i < data_tlv.length;) {
                        var tlv_tag = data_tlv[i++] & 0xff;
                        var tlv_len = data_tlv[i++] & 0xff;
                        switch (tlv_tag) {
                            case 0x00:
                                var mac = bytesToHexString(data_tlv, i, tlv_len - 1);
                                var reason_code = bytesToInt(data_tlv, i + tlv_len - 1, 1);
                                var reason_msg = batchUpdateResultArray[reason_code];
                                var item = {};
                                item.mac = mac;
                                item.reason_code = reason_code;
                                item.reason_msg = reason_msg;
                                mac_array.push(item);
                                break;
                        }
                        i += tlv_len;
                    }
                    data.mac_array = mac_array;
                    break;
                case 0x2102:
                    var mac_array = [];
                    for (var i = 0; i < data_tlv.length;) {
                        var tlv_tag = data_tlv[i++] & 0xff;
                        var tlv_len = data_tlv[i++] & 0xff;
                        switch (tlv_tag) {
                            case 0x00:
                                data.mac = bytesToHexString(data_tlv, i, tlv_len);
                                break;
                        }
                        i += tlv_len;
                    }
                    break;
            }
        }
        // }
    }

    dev_Info.data = data;
    return dev_Info;
}

function parseScanData(raw_bytes) {
    var item = {};
    var index = 0;
    item.dev_type = raw_bytes[index++];
    item.timestamp = parseInt(bytesToHexString(raw_bytes, index, 6), 16);
    index += 6;
    item.time = parse_time(item.timestamp);
    item.rssi = signedHexToInt(raw_bytes[index++].toString(16));
    item.connectable = raw_bytes[index++];
    item.mac = bytesToHexString(raw_bytes, index, 6);
    index += 6;
    if (item.dev_type == 0) {
        // badge
        item.bxp_b_timestamp = parseInt(bytesToHexString(raw_bytes, index, 6), 16);
        index += 6;
        item.bxp_b_time = parse_time(item.bxp_b_timestamp);
        item.alarm_status_code = raw_bytes[index++];
        item.alarm_status = beaconAlarmStatusArray[item.alarm_status_code];
        item.alarm_count = bytesToInt(raw_bytes, index, 2);
        index += 2;
        item.tag_id = bytesToHexString(raw_bytes, index, 3);
        index += 3;
        item.batt_v = bytesToInt(raw_bytes, index, 2) + "mV";
        index += 2;
        item.key_state = keyStateArray[raw_bytes[index]];
        index += 1;
        var firmware_ver_major = (raw_bytes[index] >> 4) & 0x0f;
        var firmware_ver_minor = raw_bytes[index] & 0x0f;
        index += 1;
        var firmware_ver_patch = raw_bytes[index] & 0xffff;
        item.firmware_version = "V" + firmware_ver_major + "." + firmware_ver_minor + "." + firmware_ver_patch;
    }
    else if (item.dev_type == 1) {
        // gateway
        var adv_name_len = raw_bytes[index++] & 0xff;
        item.adv_name = bytesToString(raw_bytes, index, adv_name_len);
        index += adv_name_len;
        var firmware_len = raw_bytes[index++] & 0xff;
        item.firmware = bytesToString(raw_bytes, index, firmware_len);
    }
    return item;
}

// =======================
function bytesToHexString(bytes, start, len) {
    var char = [];
    for (var i = 0; i < len; i++) {
        var data = bytes[start + i].toString(16);
        var dataHexStr = ("0x" + data) < 0x10 ? ("0" + data) : data;
        char.push(dataHexStr);
    }
    return char.join("");
}

function bytesToString(bytes, start, len) {
    var char = [];
    for (var i = 0; i < len; i++) {
        char.push(String.fromCharCode(bytes[start + i]));
    }
    return char.join("");
}

function bytesToInt(bytes, start, len) {
    var value = 0;
    for (var i = 0; i < len; i++) {
        var m = ((len - 1) - i) * 8;
        value = value | bytes[start + i] << m;
    }
    // var value = ((bytes[start] << 24) | (bytes[start + 1] << 16) | (bytes[start + 2] << 8) | (bytes[start + 3]));
    return value;
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

function parse_time(timestamp) {
    if (timestamp < 0xFFFFFFFF)
        timestamp = timestamp * 1000;
    var d = new Date(timestamp);

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
    time_str += ".";
    time_str += formatNumber2(d.getUTCMilliseconds());
    return time_str;
}

function formatNumber(number) {
    return number < 10 ? "0" + number : number;
}

function formatNumber2(number) {
    return number < 10 ? "00" + number : (number < 100 ? "0" + number : number);
}

/**
 * @description: 执行handlePayload方法
 */
// execute(handlePayload)

function getData(hex) {
    var length = hex.length;
    var datas = [];
    for (var i = 0; i < length; i += 2) {
        var start = i;
        var end = i + 2;
        var data = parseInt("0x" + hex.substring(start, end));
        datas.push(data);
    }
    return datas;
}

// console.log(getData("1E000000000140D5A801CEDB0FA177E50000129D313E0000020000010BBC00"));
// var input = {};
// input.fPort = 3;
// input.bytes = getData("1e00018e884dc300c701d77931d426f1018e884dc75900000c0000010bc200");
// console.log(decodeUplink(input));