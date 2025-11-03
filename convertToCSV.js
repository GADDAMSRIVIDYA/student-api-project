"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function calculateBestTwoTotal(midMarks) {
    var midTotals = midMarks.map(function (m) { return m.maths + m.physics + m.chemistry; });
    midTotals.sort(function (a, b) { return b - a; });
    return midTotals[0] + midTotals[1];
}
var inputPath = path.join(__dirname, "students.txt");
var outputPath = path.join(__dirname, "students.csv");
var data = fs.readFileSync(inputPath, "utf-8");
var students = JSON.parse(data);
var studentsWithTotals = students.map(function (s) { return (__assign(__assign({}, s), { totalMarks: calculateBestTwoTotal(s.midMarks) })); });
var rankedStudents = __spreadArray([], studentsWithTotals, true).sort(function (a, b) { return b.totalMarks - a.totalMarks; })
    .map(function (s, index) { return (__assign(__assign({}, s), { rank: index + 1 })); });
var csv = "name,rollNo,maths1,physics1,chemistry1,maths2,physics2,chemistry2,maths3,physics3,chemistry3,totalMarks,rank\n";
for (var _i = 0, rankedStudents_1 = rankedStudents; _i < rankedStudents_1.length; _i++) {
    var s = rankedStudents_1[_i];
    var m1 = s.midMarks[0];
    var m2 = s.midMarks[1];
    var m3 = s.midMarks[2];
    csv += "".concat(s.name, ",").concat(s.rollNo, ",").concat(m1.maths, ",").concat(m1.physics, ",").concat(m1.chemistry, ",").concat(m2.maths, ",").concat(m2.physics, ",").concat(m2.chemistry, ",").concat(m3.maths, ",").concat(m3.physics, ",").concat(m3.chemistry, ",").concat(s.totalMarks, ",").concat(s.rank, "\n");
}
fs.writeFileSync(outputPath, csv);
console.log("✅ students.csv created successfully with totals and ranks!");
