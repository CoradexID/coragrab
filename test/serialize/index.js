var phpSerialize = require("php-serialize");

const obj = 'a:3:{i:0;a:4:{s:2:"id";i:595560;s:7:"chapter";s:2:"14";s:9:"permalink";s:116:"kinsou-no-vermeil-gakeppuchi-majutshi-wa-saikyou-no-yakusai-to-mahou-sekai-o-tsukisusumu-chapter-14-bahasa-indonesia";s:4:"time";i:1656163843;}i:1;a:4:{s:2:"id";i:576829;s:7:"chapter";s:2:"13";s:9:"permalink";s:116:"kinsou-no-vermeil-gakeppuchi-majutshi-wa-saikyou-no-yakusai-to-mahou-sekai-o-tsukisusumu-chapter-13-bahasa-indonesia";s:4:"time";i:1653299484;}i:2;a:4:{s:2:"id";i:576827;s:7:"chapter";s:2:"12";s:9:"permalink";s:116:"kinsou-no-vermeil-gakeppuchi-majutshi-wa-saikyou-no-yakusai-to-mahou-sekai-o-tsukisusumu-chapter-12-bahasa-indonesia";s:4:"time";i:1653299437;}}';

const objs = phpSerialize.unserialize(obj);
console.log(objs);