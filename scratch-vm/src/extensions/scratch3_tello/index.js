const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWhJREFUeNrsW+1x4zgMZXb2v9KB04GyFSgd6K4CbQfaq0DbgdKBLhUoHchbgXwVyKlATgU5awacwAhIQh92bAdvBpPYsinqEQQeQdoYhUKhUCgUCoVCoVAoFAqF4mJwcyb9WO3tznFts7dXJfAQ6d4ewO6F39mCbcDWe3v5agQWe/vJeNsa/u6AnDvymQePdz7u7enaQ0Wyt25vb2DD//ne4hFt1PDdCqxH7bUj27ooZORBk4nt2DYi0rYdmP7ayasnfD+GNirkuRkMAva4EuyqYuCQKJ7R6x3Esluwe0dM28H/vz2xj37HJpfhfv9dg+dFKEYNsa5BnnhsS66BwBwepkHT7xTWkhh5dHw7cvvPIFuOjQ3c58epRfexdWAMGu92ZjtWH1LduB65UkmB6EE7/rmU6bxidJskjpXodbZQPySxMjlVGIhJzEuFHlCApGmJsM6InivRtaXEPCawZ4jKyfUa+rUYoSnxphjeszddjWyvJCTaRFCg94sjEWiTHHWKhqya3tAKaDXlxhE8RMfcPEJLrKliOQ1M7/qIBPrCQwTXauKV2VjiemYNi0eCEruaOEh4ytak3WqBaeQiUBIiqI4tJDfriLclgTXqGxLOcx6wIUIcP6jVlXPX09RigabtSYxMJetXG5PGdKqZmSU7ofhuJ2Rn14oo9/SpJ4RlniR0QF7JfFk6qlPRBWJhzMTjHt6TTPHM0bZrSraOONxwxMdMYPWy7SFwarxKR3hIRqSQlEjOC0uPQuiYNlNutrUoYHM3rAOjtIQHUsHbC+JdQkjpAjEtcgxS6fDUOOA4BwGcYxvHAS7mVCNjZkic92ZalTkhg5mPnDVWQcTCFVCPCawCwdQ3IrVgOoQkTEYGop4RBiriwZwA7jyhonfMRK8HdgINV6JOxZ7ONMJpmjPkTxkAOhitg5wGeVQoy1fCMNOzbApGF5MorclZT/MVV7OFyLN9WBE1YfveBeSRtN5ZjyUQJ42exAvXCKbMiPfMEimeGTtpRi5Jm6HBkxZkIzQAGSUlFo50JegIt36ugdA5ySKUeBpmsBogtEDXO2a1Iylc1FyoKoVz31VJCVmPHqAgDxwtRB724hju13r6VDK6s/I4TYrI72m+WAnTv1TZS6wy8+C7d0PMtfrACwXOYxtmEJzhpmDSfyaorvSBhyigLVxnm1uiyslAWBnUCgauQwTWKJYlghj5oSp0w2TZn45Or5n3HiYSMOxJ/DND59k+Dn+fyFQb9pu35uP5m+G9FyBqeJaNed+bHvZsXkkbD2A7+PyzYQ4z3ThG97eRbwRxnX02h5tAFnfw0MO1HxNkyhoebgftDH38y7xv2HN92yLC1tCHzUKD6RWKFeP6CbIVEz8lRVWJZIrhHjmTeDpHhh+zd7xUEhtVzm+FFY5QcqhRFozQOrY0pzvBUJgzQ4yqxaERTUmyejuxzRXtZ4Huk4jD9cLIXOg5muSEhDVIMEcO2XZxJEaOKswYa2buv2ACZ8XDb59A4KC3/kaS5l+H5OGwIZp0zpmbW4++FeP7J3riC4jgJ5KM7OHLW6TlHglZW/h7P+P+dhGwM18Aufl4MGjO9gHewvgyoFpzTgxszlUPjtGNY08wrAx/WmHsURJcVY8u3ZvGFFMjj/CuTPh4XUyy/0WfpY7Nx8NDIU/KHEVaTuJUaA3NHVfLzBUgIjVIS2Ts+KwlITeHJ8QieC2pBfbmSk7xhyo/dk8lM4e/RpIkDd926eIx7+bMiPwF9b07x2cezXuB0yC9aLXjPdGLOxDqj+YMftl56vVyKZyWXMleklSuzgNDhN56Vh5b8/5zr1ejUCgUCoVCoVAoFAqFQqFQKDj8L8AArqESEfsu3jMAAAAASUVORK5CYII=';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWhJREFUeNrsW+1x4zgMZXb2v9KB04GyFSgd6K4CbQfaq0DbgdKBLhUoHchbgXwVyKlATgU5awacwAhIQh92bAdvBpPYsinqEQQeQdoYhUKhUCgUCoVCoVAoFAqF4mJwcyb9WO3tznFts7dXJfAQ6d4ewO6F39mCbcDWe3v5agQWe/vJeNsa/u6AnDvymQePdz7u7enaQ0Wyt25vb2DD//ne4hFt1PDdCqxH7bUj27ooZORBk4nt2DYi0rYdmP7ayasnfD+GNirkuRkMAva4EuyqYuCQKJ7R6x3Esluwe0dM28H/vz2xj37HJpfhfv9dg+dFKEYNsa5BnnhsS66BwBwepkHT7xTWkhh5dHw7cvvPIFuOjQ3c58epRfexdWAMGu92ZjtWH1LduB65UkmB6EE7/rmU6bxidJskjpXodbZQPySxMjlVGIhJzEuFHlCApGmJsM6InivRtaXEPCawZ4jKyfUa+rUYoSnxphjeszddjWyvJCTaRFCg94sjEWiTHHWKhqya3tAKaDXlxhE8RMfcPEJLrKliOQ1M7/qIBPrCQwTXauKV2VjiemYNi0eCEruaOEh4ytak3WqBaeQiUBIiqI4tJDfriLclgTXqGxLOcx6wIUIcP6jVlXPX09RigabtSYxMJetXG5PGdKqZmSU7ofhuJ2Rn14oo9/SpJ4RlniR0QF7JfFk6qlPRBWJhzMTjHt6TTPHM0bZrSraOONxwxMdMYPWy7SFwarxKR3hIRqSQlEjOC0uPQuiYNlNutrUoYHM3rAOjtIQHUsHbC+JdQkjpAjEtcgxS6fDUOOA4BwGcYxvHAS7mVCNjZkic92ZalTkhg5mPnDVWQcTCFVCPCawCwdQ3IrVgOoQkTEYGop4RBiriwZwA7jyhonfMRK8HdgINV6JOxZ7ONMJpmjPkTxkAOhitg5wGeVQoy1fCMNOzbApGF5MorclZT/MVV7OFyLN9WBE1YfveBeSRtN5ZjyUQJ42exAvXCKbMiPfMEimeGTtpRi5Jm6HBkxZkIzQAGSUlFo50JegIt36ugdA5ySKUeBpmsBogtEDXO2a1Iylc1FyoKoVz31VJCVmPHqAgDxwtRB724hju13r6VDK6s/I4TYrI72m+WAnTv1TZS6wy8+C7d0PMtfrACwXOYxtmEJzhpmDSfyaorvSBhyigLVxnm1uiyslAWBnUCgauQwTWKJYlghj5oSp0w2TZn45Or5n3HiYSMOxJ/DND59k+Dn+fyFQb9pu35uP5m+G9FyBqeJaNed+bHvZsXkkbD2A7+PyzYQ4z3ThG97eRbwRxnX02h5tAFnfw0MO1HxNkyhoebgftDH38y7xv2HN92yLC1tCHzUKD6RWKFeP6CbIVEz8lRVWJZIrhHjmTeDpHhh+zd7xUEhtVzm+FFY5QcqhRFozQOrY0pzvBUJgzQ4yqxaERTUmyejuxzRXtZ4Huk4jD9cLIXOg5muSEhDVIMEcO2XZxJEaOKswYa2buv2ACZ8XDb59A4KC3/kaS5l+H5OGwIZp0zpmbW4++FeP7J3riC4jgJ5KM7OHLW6TlHglZW/h7P+P+dhGwM18Aufl4MGjO9gHewvgyoFpzTgxszlUPjtGNY08wrAx/WmHsURJcVY8u3ZvGFFMjj/CuTPh4XUyy/0WfpY7Nx8NDIU/KHEVaTuJUaA3NHVfLzBUgIjVIS2Ts+KwlITeHJ8QieC2pBfbmSk7xhyo/dk8lM4e/RpIkDd926eIx7+bMiPwF9b07x2cezXuB0yC9aLXjPdGLOxDqj+YMftl56vVyKZyWXMleklSuzgNDhN56Vh5b8/5zr1ejUCgUCoVCoVAoFAqFQqFQKDj8L8AArqESEfsu3jMAAAAASUVORK5CYII=';

const message = {
    takeoff: {
        'ja': '離陸する',
        'ja-Hira': 'りりくする',
        'zh-cn': '起飞',
        'en': 'takeoff'
    },
    land: {
        'ja': '着陸する',
        'ja-Hira': 'ちゃくりくする',
        'zh-cn': '降落',
        'en': 'land'
    },
    emergency: {
        'ja': '紧急停机',
        'ja-Hira': '紧急停机',
        'zh-cn': '紧急停机',
        'en': 'emergency'
    },
    up: {
        'ja': '上に [X]cm 上がる',
        'ja-Hira': 'うえに [X] センチあがる',
        'zh-cn': '向上 [X] 厘米',
        'en': 'up [X] cm'
    },
    down: {
        'ja': '下に [X]cm 下がる',
        'ja-Hira': 'したに [X] センチさがる',
        'zh-cn': '向下 [X] 厘米',
        'en': 'down [X] cm'
    },
    left: {
        'ja': '左に [X]cm 動く',
        'ja-Hira': 'ひだりに [X] センチうごく',
        'zh-cn': '向左 [X] 厘米',
        'en': 'move left [X] cm'
    },
    right: {
        'ja': '右に [X]cm 動く',
        'ja-Hira': 'みぎに [X] センチうごく',
        'zh-cn': '向右 [X] 厘米',
        'en': 'move right [X] cm'
    },
    forward: {
        'ja': '前に [X]cm 進む',
        'ja-Hira': 'まえに [X] センチすすむ',
        'zh-cn': '前进 [X] 厘米',
        'en': 'move forward [X] cm'
    },
    back: {
        'ja': '後ろに [X]cm 下がる',
        'ja-Hira': 'うしろに [X] センチさがる',
        'zh-cn': '后退 [X] 厘米',
        'en': 'move back [X] cm'
    },
    cw: {
        'ja': '[X] 度右に回る',
        'ja-Hira': '[X] どみぎにまわる',
        'zh-cn': '向右旋转 [X] 度',
        'en': 'rotate [X] degrees right'
    },
    ccw: {
        'ja': '[X] 度左に回る',
        'ja-Hira': '[X] どひだりにまわる',
        'zh-cn': '向左旋转 [X] 度',
        'en': 'rotate [X] degrees left'
    },
    flip: {
        'ja': '向 [DIRECTION] 翻滚',
        'ja-Hira': '向 [DIRECTION] 翻滚',
        'zh-cn': '向 [DIRECTION] 翻滚',
        'en': 'flip to [DIRECTION]'
    },
    flip_front: {
        'ja': '前',
        'ja-Hira': '前',
        'zh-cn': '前',
        'en': 'front'
    },
    flip_back: {
        'ja': '后',
        'ja-Hira': '后',
        'zh-cn': '后',
        'en': 'back'
    },
    flip_left: {
        'ja': '左',
        'ja-Hira': '左',
        'zh-cn': '左',
        'en': 'left'
    },
    flip_right: {
        'ja': '右',
        'ja-Hira': '右',
        'zh-cn': '右',
        'en': 'right'
    },
    pitch: {
        'ja': 'ピッチ',
        'ja-Hira': 'ピッチ',
        'zh-cn': '俯仰轴姿态角(°)',
        'en': 'pitch'
    },
    roll: {
        'ja': 'ロール',
        'ja-Hira': 'ロール',
        'zh-cn': '横滚轴姿态角(°)',
        'en': 'roll'
    },
    yaw: {
        'ja': 'ヨー',
        'ja-Hira': 'ヨー',
        'zh-cn': '平移轴姿态角(°)',
        'en': 'yaw'
    },
    vgx: {
        'ja': 'x方向の速度',
        'ja-Hira': 'xほうこうのはやさ',
        'zh-cn': 'X轴速度(厘米/秒)',
        'en': 'speed x'
    },
    vgy: {
        'ja': 'y方向の速度',
        'ja-Hira': 'yほうこうのはやさ',
        'zh-cn': 'Y轴速度(厘米/秒)',
        'en': 'speed y'
    },
    vgz: {
        'ja': 'z方向の速度',
        'ja-Hira': 'zほうこうのはやさ',
        'zh-cn': 'Z轴速度(厘米/秒)',
        'en': 'speed z'
    },
    tof: {
        'ja': '地面からの高度',
        'ja-Hira': 'じめんからのたかさ',
        'zh-cn': 'TOF高度(厘米)',
        'en': 'height from ground'
    },
    height: {
        'ja': '離陸した場所からの高度',
        'ja-Hira': 'りりくしたばしょからのたかさ',
        'zh-cn': '相对高度(厘米)',
        'en': 'height from takeoff point'
    },
    bat: {
        'ja': 'バッテリー残量',
        'ja-Hira': 'バッテリーざんりょう',
        'zh-cn': '电池电量(%)',
        'en': 'battery remaining'
    },
    baro: {
        'ja': '気圧計による高さ',
        'ja-Hira': 'きあつけいによるたかさ',
        'zh-cn': '气压计高度(厘米)',
        'en': 'height by barometer'
    },
    time: {
        'ja': '飛行時間',
        'ja-Hira': 'ひこうじかん',
        'zh-cn': '飞行时间',
        'en': 'flying time'
    },
    agx: {
        'ja': 'x方向の加速度',
        'ja-Hira': 'xほうこうのかそくど',
        'zh-cn': 'X轴加速度(0.001g)',
        'en': 'acceleration x'
    },
    agy: {
        'ja': 'y方向の加速度',
        'ja-Hira': 'yほうこうのかそくど',
        'zh-cn': 'Y轴加速度(0.001g)',
        'en': 'acceleration y'
    },
    agz: {
        'ja': 'z方向の加速度',
        'ja-Hira': 'zほうこうのかそくど',
        'zh-cn': 'Z轴加速度(0.001g)',
        'en': 'acceleration z'
    }

};

const FilpDirection = {
    FRONT: 'f',
    BACK: 'b',
    LEFT: 'l',
    RIGHT: 'r',
};

/**
 * Class for the Tello
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3Tello {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.state = {};
        this.getState();
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        if (formatMessage.setup().locale === 'ja' || formatMessage.setup().locale === 'ja-Hira' || formatMessage.setup().locale === 'zh-cn') {
            this.locale = formatMessage.setup().locale;
        } else {
            this.locale = 'en';
        }

        return {
            id: 'tello',
            name: 'Tello',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'takeoff',
                    text: message.takeoff[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'land',
                    text: message.land[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'emergency',
                    text: message.emergency[this.locale],
                    blockType: BlockType.COMMAND
                },

                '---',
                {
                    opcode: 'up',
                    text: message.up[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'down',
                    text: message.down[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'left',
                    text: message.left[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'right',
                    text: message.right[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'forward',
                    text: message.forward[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'back',
                    text: message.back[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'cw',
                    text: message.cw[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'ccw',
                    text: message.ccw[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'flip',
                    text: message.flip[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'tiltDirection',
                            defaultValue: FilpDirection.FRONT
                        }
                    }
                },
                '---',
                {
                    opcode: 'pitch',
                    text: message.pitch[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'roll',
                    text: message.roll[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'yaw',
                    text: message.yaw[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgx',
                    text: message.vgx[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgy',
                    text: message.vgy[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgz',
                    text: message.vgz[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'tof',
                    text: message.tof[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'height',
                    text: message.height[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'bat',
                    text: message.bat[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'baro',
                    text: message.baro[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'time',
                    text: message.time[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agx',
                    text: message.agx[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agy',
                    text: message.agy[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agz',
                    text: message.agz[this.locale],
                    blockType: BlockType.REPORTER
                }
            ],
            menus: {
                tiltDirection: {
                    acceptReporters: true,
                    items: this.TILT_DIRECTION_MENU
                }
            }
        };
    }

    getState () {
        setInterval(() => {
            telloProcessor.state().then(response => {
                this.state = JSON.parse(response);
            });
        }, 100);
    }

    takeoff () {
        telloProcessor.send('takeoff');
    }

    land () {
        telloProcessor.send('land');
    }

    emergency () {
        telloProcessor.send('emergency');
    }

    up (args) {
        telloProcessor.send(`up ${Cast.toString(args.X)}`);
    }

    down (args) {
        telloProcessor.send(`down ${Cast.toString(args.X)}`);
    }

    left (args) {
        telloProcessor.send(`left ${Cast.toString(args.X)}`);
    }

    right (args) {
        telloProcessor.send(`right ${Cast.toString(args.X)}`);
    }

    forward (args) {
        telloProcessor.send(`forward ${Cast.toString(args.X)}`);
    }

    back (args) {
        telloProcessor.send(`back ${Cast.toString(args.X)}`);
    }

    cw (args) {
        telloProcessor.send(`cw ${Cast.toString(args.X)}`);
    }

    ccw (args) {
        telloProcessor.send(`ccw ${Cast.toString(args.X)}`);
    }

    flip (args) {
        telloProcessor.send(`flip ${Cast.toString(args.X)}`);
    }

    pitch () {
        return this.state.pitch;
    }

    roll () {
        return this.state.roll;
    }

    yaw () {
        return this.state.yaw;
    }

    vgx () {
        return this.state.vgx;
    }

    vgy () {
        return this.state.vgy;
    }

    vgz () {
        return this.state.vgz;
    }

    tof () {
        return this.state.tof;
    }

    height () {
        return this.state.h;
    }

    bat () {
        return this.state.bat;
    }

    baro () {
        return this.state.baro;
    }

    time () {
        return this.state.time;
    }

    agx () {
        return this.state.agx;
    }

    agy () {
        return this.state.agy;
    }

    agz () {
        return this.state.agz;
    }

    get TILT_DIRECTION_MENU () {
        return [
            {
                text: message.flip_front[this.locale],
                value: FilpDirection.FRONT
            },
            {
                text: message.flip_back[this.locale],
                value: FilpDirection.BACK
            },
            {
                text: message.flip_left[this.locale],
                value: FilpDirection.LEFT
            },
            {
                text: message.flip_right[this.locale],
                value: FilpDirection.RIGHT
            }
        ];
    }
}
module.exports = Scratch3Tello;
