import { useState, useMemo } from 'react'
import Head from 'next/head'

// ─── INITIAL DATA ───────────────────────────────────────────
const INITIAL_INVENTORY = [
  // AM SPIRIT
  { id:1,  brand:'AM SPIRIT', name:'AMER SPIRIT BX CELADON',             sku:'10631461', tier:'PREMIUM',     storage:1, shelf:1 },
  { id:2,  brand:'AM SPIRIT', name:'AMER SPIRIT BX KNG BLUE',             sku:'10631454', tier:'PREMIUM',     storage:1, shelf:1 },
  { id:3,  brand:'AM SPIRIT', name:'AMER SPIRIT BX KNG ORANGE',           sku:'10631485', tier:'PREMIUM',     storage:1, shelf:0 },
  { id:4,  brand:'AM SPIRIT', name:'AMER SPIRIT BX MLW YELLOW',           sku:'10631478', tier:'PREMIUM',     storage:1, shelf:1 },
  { id:5,  brand:'AM SPIRIT', name:'AMER SPIRIT BX US DRKYBLUE',          sku:'10631447', tier:'PREMIUM',     storage:1, shelf:1 },
  { id:6,  brand:'AM SPIRIT', name:'AMER SPIRIT BX PERIO BLCK',           sku:'10631553', tier:'PREMIUM',     storage:1, shelf:1 },
  { id:7,  brand:'AM SPIRIT', name:'AMER SPIRIT ORGANIC GOLD',            sku:'10631591', tier:'SUB GENERIC', storage:1, shelf:1 },
  { id:8,  brand:'AM SPIRIT', name:'AMER SPIRIT ORGANIC GRNDK',           sku:'10631423', tier:'SUB GENERIC', storage:1, shelf:1 },
  { id:9,  brand:'AM SPIRIT', name:'AMER SPIRIT ORGANIC GRNT',            sku:'10631430', tier:'SUB GENERIC', storage:1, shelf:1 },
  { id:10, brand:'AM SPIRIT', name:'AMER SPIRIT ORGANIC TURQU',           sku:'10631355', tier:'SUB GENERIC', storage:1, shelf:1 },
  { id:11, brand:'AM SPIRIT', name:'AMER SPIRIT ORGANIC SKY',             sku:'10631394', tier:'SUB GENERIC', storage:1, shelf:1 },
  // B&H MERIT
  { id:12, brand:'B&H MERIT', name:'B&H 100 MTH BOX FSC',                sku:'10410387', tier:'PREMIUM', storage:1, shelf:1 },
  { id:13, brand:'B&H MERIT', name:'B&H LUXURY MERIT 100BOXFSC',         sku:'10410165', tier:'PREMIUM', storage:1, shelf:1 },
  { id:14, brand:'B&H MERIT', name:'B&H DLXNTH 100BXFSC',                sku:'10410462', tier:'PREMIUM', storage:1, shelf:1 },
  // BASIC
  { id:16, brand:'BASIC', name:'BASIC BOX 100 BLUE',                     sku:'10125007', tier:'GENERIC', storage:1, shelf:0 },
  { id:17, brand:'BASIC', name:'BASIC BOX 100 FSC',                      sku:'10125076', tier:'GENERIC', storage:1, shelf:0 },
  // CAMEL
  { id:18, brand:'CAMEL', name:'CAMEL CRUSH RICH BOX FSC',               sku:'10380802', tier:'PREMIUM', storage:20, shelf:5 },
  { id:19, brand:'CAMEL', name:'CAMEL CRUSH SILVER MEN BX',              sku:'10380789', tier:'PREMIUM', storage:7,  shelf:2 },
  { id:20, brand:'CAMEL', name:'CAMEL CRUSH SMOOTH MTH BX',              sku:'10380758', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:21, brand:'CAMEL', name:'CAMEL CRUSH SMOOTH SIL BX',              sku:'10380765', tier:'PREMIUM', storage:1,  shelf:0 },
  { id:22, brand:'CAMEL', name:'CAMEL FILTER HARD PK FSC',               sku:'10380779', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:23, brand:'CAMEL', name:'CAMEL GOLD BOX K',                       sku:'10382028', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:24, brand:'CAMEL', name:'CAMEL JADE MTH K BOX',                   sku:'10382059', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:25, brand:'CAMEL', name:'CAMEL JADE SILVER BOX K',                sku:'10382011', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:26, brand:'CAMEL', name:'CAMEL ROYAL BOX K',                      sku:'10382042', tier:'PREMIUM', storage:2,  shelf:1 },
  { id:27, brand:'CAMEL', name:'CAMEL 99 BLUE BOX',                      sku:'10382035', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:28, brand:'CAMEL', name:'CAMEL 99 FILTER BOX K',                  sku:'10382004', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:29, brand:'CAMEL', name:'CAMEL BLUE LT KING SZ FSC',              sku:'10380604', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:30, brand:'CAMEL', name:'CAMEL CLASSIC GOLD 99 BOX',              sku:'10380628', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:31, brand:'CAMEL', name:'CAMEL CLASSIC GOLD KS BOX',              sku:'10380611', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:32, brand:'CAMEL', name:'CAMEL CRUSH BOX FSC',                    sku:'10380796', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:33, brand:'CAMEL', name:'CAMEL CRUSH REG MENTH BOX',              sku:'10383772', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:34, brand:'CAMEL', name:'CAMEL NO.9 KING FSC',                    sku:'10380468', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:35, brand:'CAMEL', name:'CAMEL PLATINUM BOX KS FSC',              sku:'10380437', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:36, brand:'CAMEL', name:'CAMEL SILVER BX FSC',                    sku:'10380536', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:37, brand:'CAMEL', name:'CAMEL SILVER RYL BX FSC',                sku:'10380793', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:38, brand:'CAMEL', name:'CAMEL TURK SILVER BX FSC',               sku:'10380451', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:39, brand:'CAMEL', name:'CAMEL WIDE LT BX FSC',                   sku:'10380581', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:40, brand:'CAMEL', name:'CAMEL WIDE BLUE LT BX FSC',              sku:'10380590', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:41, brand:'CAMEL', name:'CAMEL WIDE FTL KS BX FSC',               sku:'10380550', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:42, brand:'CAMEL', name:'CAMEL WIDE MENTH BL BX FSC',             sku:'10380543', tier:'PREMIUM', storage:1,  shelf:0 },
  { id:43, brand:'CAMEL', name:'CAMEL REGULAR NON FILTER',               sku:'10380500', tier:'PREMIUM', storage:1,  shelf:0 },
  // CAPRI/CARLTON
  { id:45, brand:'CAPRI/CARLTON', name:'CAPRI IMAGE 120 FSC',            sku:'10411001', tier:'PREMIUM', storage:1, shelf:1 },
  { id:46, brand:'CAPRI/CARLTON', name:'CAPRI WIDE BX 100 LT FSC',       sku:'10250501', tier:'PREMIUM', storage:1, shelf:1 },
  { id:47, brand:'CAPRI/CARLTON', name:'CAPRI MEN INDIGO 100 FSC',       sku:'10552063', tier:'PREMIUM', storage:1, shelf:1 },
  { id:48, brand:'CAPRI/CARLTON', name:'CAPRI VIOLET 100 ULT FSC',       sku:'10552117', tier:'PREMIUM', storage:1, shelf:1 },
  { id:49, brand:'CAPRI/CARLTON', name:'CARLTON MENT BOX 100 FSC',       sku:'10411254', tier:'PREMIUM', storage:1, shelf:1 },
  { id:50, brand:'CAPRI/CARLTON', name:'CARLTON MEN BOX 100 FSC',        sku:'10411063', tier:'PREMIUM', storage:1, shelf:1 },
  { id:51, brand:'CAPRI/CARLTON', name:'CARLTON MEN MENTH 120 FSC',      sku:'10411278', tier:'PREMIUM', storage:1, shelf:1 },
  // DORAL
  { id:53, brand:'DORAL', name:'DORAL MEN GOLD LT BX 100FSC',           sku:'10120781', tier:'SUB GENERIC', storage:1, shelf:1 },
  { id:54, brand:'DORAL', name:'DORAL SILVER UL BX KS FSC',             sku:'10120798', tier:'SUB GENERIC', storage:1, shelf:1 },
  { id:55, brand:'DORAL', name:'DORAL RED FF BX 100 FSC',               sku:'10120781', tier:'SUB GENERIC', storage:1, shelf:1 },
  { id:56, brand:'DORAL', name:'DORAL GOLD LT BOX KS FSC',              sku:'10120866', tier:'SUB GENERIC', storage:1, shelf:1 },
  { id:57, brand:'DORAL', name:'DORAL GOLD LT BX 100 FSC',              sku:'10125885', tier:'SUB GENERIC', storage:1, shelf:1 },
  { id:58, brand:'DORAL', name:'DORAL MEN FF BOX KS FSC',               sku:'20774',    tier:'SUB GENERIC', storage:1, shelf:1 },
  // KOOL
  { id:62, brand:'KOOL', name:'KOOL KING BOX',                          sku:'10358832', tier:'PREMIUM', storage:8,  shelf:9 },
  { id:63, brand:'KOOL', name:'KOOL BOX BLUE',                          sku:'10358849', tier:'PREMIUM', storage:6,  shelf:6 },
  { id:64, brand:'KOOL', name:'KOOL KING SP',                           sku:'10387856', tier:'PREMIUM', storage:2,  shelf:3 },
  { id:65, brand:'KOOL', name:'KOOL 100 BOX',                           sku:'10387849', tier:'PREMIUM', storage:2,  shelf:3 },
  { id:66, brand:'KOOL', name:'KOOL 100 BOX BLUE',                      sku:'10418437', tier:'PREMIUM', storage:6,  shelf:3 },
  { id:67, brand:'KOOL', name:'KOOL BLACK BLK/WIN SEL SUB',             sku:'10418444', tier:'PREMIUM', storage:2,  shelf:1 },
  { id:68, brand:'KOOL', name:'KOOL BLACK BOX 100',                     sku:'10418581', tier:'PREMIUM', storage:1,  shelf:0 },
  { id:69, brand:'KOOL', name:'KOOL BLACK KINGS BOX',                   sku:'10418165', tier:'PREMIUM', storage:1,  shelf:0 },
  // L&M
  { id:70, brand:'L&M', name:'L&M BLUE KING 100S BOX FSC',              sku:'10125569', tier:'PREMIUM', storage:1, shelf:0 },
  { id:71, brand:'L&M', name:'L&M BOLD KING BOX FSC',                   sku:'10120552', tier:'PREMIUM', storage:1, shelf:1 },
  { id:72, brand:'L&M', name:'L&M BOLD KING BOX (2)',                    sku:'10120613', tier:'PREMIUM', storage:1, shelf:1 },
  { id:73, brand:'L&M', name:'L&M FF KINGS BOX FSC',                    sku:'10120576', tier:'PREMIUM', storage:1, shelf:1 },
  { id:74, brand:'L&M', name:'L&M MENTHOL 100S BOX FSC',                sku:'10125250', tier:'PREMIUM', storage:1, shelf:1 },
  { id:75, brand:'L&M', name:'L&M MENTHOL KING BOX FSC',                sku:'10125274', tier:'PREMIUM', storage:1, shelf:1 },
  // LUCKY STRIKE
  { id:76, brand:'LUCKY STRIKE', name:'LUCKY STRIKE ACTIVATE GRN',      sku:'10388556', tier:'GENERIC', storage:7, shelf:1 },
  { id:77, brand:'LUCKY STRIKE', name:'LUCKY STRIKE ACTIVATE BLU',      sku:'10388519', tier:'GENERIC', storage:5, shelf:2 },
  { id:78, brand:'LUCKY STRIKE', name:'LUCKY STRIKE GOLD 100 BOX',      sku:'10388518', tier:'GENERIC', storage:3, shelf:4 },
  { id:79, brand:'LUCKY STRIKE', name:'LUCKY STRIKE GOLD BOX',          sku:'10388526', tier:'GENERIC', storage:3, shelf:2 },
  { id:80, brand:'LUCKY STRIKE', name:'LUCKY STRIKE MEN SLY BOX',       sku:'10388532', tier:'GENERIC', storage:1, shelf:1 },
  { id:81, brand:'LUCKY STRIKE', name:'LUCKY STRIKE MEN 100S BOX',      sku:'10418833', tier:'GENERIC', storage:1, shelf:2 },
  { id:82, brand:'LUCKY STRIKE', name:'LUCKY STRIKE MENTHOL BOX',       sku:'10388625', tier:'GENERIC', storage:1, shelf:1 },
  { id:83, brand:'LUCKY STRIKE', name:'LUCKY STRIKE RED BOX',           sku:'10388501', tier:'GENERIC', storage:4, shelf:2 },
  // MARLBORO
  { id:84,  brand:'MARLBORO', name:'MARLBORO MEN GOLD KSBXFSC',         sku:'10383438', tier:'PREMIUM', storage:3,  shelf:3 },
  { id:85,  brand:'MARLBORO', name:'MARLBORO MEN SILV KSBXFSC',         sku:'10383784', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:86,  brand:'MARLBORO', name:'MARLBORO MEN GOLD 100 BX',          sku:'10413807', tier:'PREMIUM', storage:3,  shelf:4 },
  { id:87,  brand:'MARLBORO', name:'MARLBORO MEN SMOOTH BX',            sku:'10383636', tier:'PREMIUM', storage:1,  shelf:2 },
  { id:88,  brand:'MARLBORO', name:'MARLBORO MEN SMOOTH 100BX',         sku:'10413821', tier:'PREMIUM', storage:1,  shelf:3 },
  { id:89,  brand:'MARLBORO', name:'MARLBORO MEN MENTH ICE BX',         sku:'10383445', tier:'PREMIUM', storage:2,  shelf:4 },
  { id:90,  brand:'MARLBORO', name:'MARLBORO MEN ICE BOX',              sku:'10383599', tier:'PREMIUM', storage:4,  shelf:5 },
  { id:91,  brand:'MARLBORO', name:'MARLBORO BOX FF 100 FSC',           sku:'10419708', tier:'PREMIUM', storage:2,  shelf:3 },
  { id:92,  brand:'MARLBORO', name:'MARLBORO GOLD KING BOX FSC',        sku:'10383597', tier:'PREMIUM', storage:2,  shelf:3 },
  { id:93,  brand:'MARLBORO', name:'MARLBORO GOLD 100S BOX FSC',        sku:'10383537', tier:'PREMIUM', storage:1,  shelf:5 },
  { id:94,  brand:'MARLBORO', name:'MARLBORO RED LABEL 100S BOXFSC',    sku:'10383414', tier:'PREMIUM', storage:4,  shelf:2 },
  { id:95,  brand:'MARLBORO', name:'MARLBORO RED LABEL BX FSC',         sku:'10413777', tier:'PREMIUM', storage:1,  shelf:3 },
  { id:96,  brand:'MARLBORO', name:'MARLBORO SILVER SPBLND GOLD BX',    sku:'10383643', tier:'PREMIUM', storage:2,  shelf:8 },
  { id:97,  brand:'MARLBORO', name:'MARLBORO SILVER SPBLND D100FSC',    sku:'10383628', tier:'PREMIUM', storage:4,  shelf:3 },
  { id:98,  brand:'MARLBORO', name:'MARLBORO SILVER SPBLND REDBXFSC',   sku:'10383852', tier:'PREMIUM', storage:4,  shelf:5 },
  { id:99,  brand:'MARLBORO', name:'MARLBORO SILVER BX KS FSC',         sku:'10383483', tier:'PREMIUM', storage:3,  shelf:7 },
  { id:100, brand:'MARLBORO', name:'MARLBORO SILVER 100 BX FSC',        sku:'10383414', tier:'PREMIUM', storage:1,  shelf:5 },
  { id:101, brand:'MARLBORO', name:'MARLBORO SOUTHERN CUT BOX',         sku:'10383483', tier:'PREMIUM', storage:1,  shelf:3 },
  { id:102, brand:'MARLBORO', name:'MARLBORO BLK GOLD 100 BX',          sku:'10413883', tier:'PREMIUM', storage:1,  shelf:4 },
  { id:103, brand:'MARLBORO', name:'MARLBORO BLK GOLD BOX',             sku:'10383704', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:104, brand:'MARLBORO', name:'MARLBORO BLACK SP BL BOX',          sku:'10383674', tier:'PREMIUM', storage:3,  shelf:3 },
  { id:105, brand:'MARLBORO', name:'MARLBORO BLACK SP BL 100B',         sku:'10383681', tier:'PREMIUM', storage:2,  shelf:3 },
  { id:106, brand:'MARLBORO', name:'MARLBORO BLACK MEN SP BLD',         sku:'10383636', tier:'PREMIUM', storage:4,  shelf:4 },
  { id:107, brand:'MARLBORO', name:'MARLBORO BLACK LOW PREMIUM',        sku:'10383711', tier:'PREMIUM', storage:5,  shelf:2 },
  { id:108, brand:'MARLBORO', name:'MARLBORO 72S SILVER BXFSC',         sku:'10383629', tier:'PREMIUM', storage:0,  shelf:2 },
  { id:109, brand:'MARLBORO', name:'MARLBORO 72S BLACK MTH BXFSC',      sku:'10383780', tier:'PREMIUM', storage:3,  shelf:1 },
  { id:110, brand:'MARLBORO', name:'MARLBORO 72S GREEN BXFSC',          sku:'10383742', tier:'PREMIUM', storage:2,  shelf:0 },
  { id:111, brand:'MARLBORO', name:'MARLBORO MEN BLUE 100 KSBXFSC',     sku:'10383612', tier:'PREMIUM', storage:1,  shelf:1 },
  { id:112, brand:'MARLBORO', name:'MARLBORO MEN GRN BX 100 FSC',       sku:'10383604', tier:'PREMIUM', storage:1,  shelf:1 },
  // MAVERICK
  { id:119, brand:'MAVERICK', name:'MAVERICK GOLD 100 BOX',             sku:'10387924', tier:'GENERIC', storage:2, shelf:1 },
  { id:120, brand:'MAVERICK', name:'MAVERICK GOLD KING BOX',            sku:'10418529', tier:'GENERIC', storage:1, shelf:0 },
  { id:121, brand:'MAVERICK', name:'MAVERICK MENTHOL KING BOX',         sku:'10418505', tier:'GENERIC', storage:1, shelf:0 },
  { id:122, brand:'MAVERICK', name:'MAVERICK MENTHOL 100 BOX',          sku:'10387931', tier:'GENERIC', storage:1, shelf:0 },
  { id:123, brand:'MAVERICK', name:'MAVERICK RED K BOX',                sku:'10418390', tier:'GENERIC', storage:2, shelf:2 },
  { id:124, brand:'MAVERICK', name:'MAVERICK SILVER 100 BOX',           sku:'10418499', tier:'GENERIC', storage:1, shelf:1 },
  // MISTY
  { id:126, brand:'MISTY', name:'MISTY BLUE BOX 120 LT FSC',            sku:'10129760', tier:'GENERIC', storage:1, shelf:0 },
  { id:127, brand:'MISTY', name:'MISTY BLUE 100 LIGHTS FSC',            sku:'10126431', tier:'GENERIC', storage:1, shelf:0 },
  { id:128, brand:'MISTY', name:'MISTY MEN GRN BX 100 FSC',             sku:'10129784', tier:'GENERIC', storage:1, shelf:0 },
  // MONTCLAIR
  { id:130, brand:'MONTCLAIR', name:'MONTCLAIR BLUE 100 BOX',           sku:'10126521', tier:'SUB GENERIC', storage:2, shelf:2 },
  // NEWPORT
  { id:131, brand:'NEWPORT', name:'NEWPORT BOX 100S FSC',               sku:'10383933', tier:'PREMIUM', storage:2, shelf:5 },
  { id:132, brand:'NEWPORT', name:'NEWPORT KINGS BOX FSC',              sku:'10383957', tier:'PREMIUM', storage:1, shelf:3 },
  { id:133, brand:'NEWPORT', name:'NEWPORT KINGS SOFT FSC',             sku:'10383957', tier:'PREMIUM', storage:1, shelf:4 },
  { id:134, brand:'NEWPORT', name:'NEWPORT 100S SOFTPACK FSC',          sku:'10383902', tier:'PREMIUM', storage:1, shelf:0 },
  { id:135, brand:'NEWPORT', name:'NEWPORT PLATINUM BLU 100BX',         sku:'10414224', tier:'PREMIUM', storage:1, shelf:0 },
  { id:136, brand:'NEWPORT', name:'NEWPORT SMOOTH 100',                 sku:'10414156', tier:'PREMIUM', storage:2, shelf:0 },
  { id:137, brand:'NEWPORT', name:'NEWPORT MEN GOLD BOX FSC',           sku:'10383940', tier:'PREMIUM', storage:1, shelf:1 },
  { id:138, brand:'NEWPORT', name:'NEWPORT MEN BLUE BOX FSC',           sku:'10414170', tier:'PREMIUM', storage:1, shelf:1 },
  { id:139, brand:'NEWPORT', name:'NEWPORT MEN GOLD BOXFSC',            sku:'10383964', tier:'PREMIUM', storage:6, shelf:1 },
  { id:140, brand:'NEWPORT', name:'NEWPORT MEN GOLD BLUE BOX',          sku:'10414194', tier:'PREMIUM', storage:6, shelf:1 },
  { id:141, brand:'NEWPORT', name:'NEWPORT MEN MENTH BLU BOX',          sku:'10383971', tier:'PREMIUM', storage:1, shelf:1 },
  { id:142, brand:'NEWPORT', name:'NEWPORT NONMENTHL GL BX',            sku:'10414231', tier:'PREMIUM', storage:2, shelf:2 },
  { id:143, brand:'NEWPORT', name:'NEWPORT NONMENTHL KSBXFSC',          sku:'10414217', tier:'PREMIUM', storage:1, shelf:1 },
  { id:144, brand:'NEWPORT', name:'NEWPORT NONMENTH 100BPFSC',          sku:'10383988', tier:'PREMIUM', storage:1, shelf:1 },
  // PALL MALL
  { id:147, brand:'PALL MALL', name:'PALL MEN 100 BOX-FSC',             sku:'10384459', tier:'GENERIC', storage:1, shelf:2 },
  { id:148, brand:'PALL MALL', name:'PALL MALL ORG KS BOX FSC',         sku:'10384510', tier:'GENERIC', storage:1, shelf:2 },
  { id:149, brand:'PALL MALL', name:'PALL MALL RED 100 BX FFSC',        sku:'10414552', tier:'GENERIC', storage:1, shelf:2 },
  { id:150, brand:'PALL MALL', name:'PALL MALL RED KS BOX FSC',         sku:'10414576', tier:'GENERIC', storage:1, shelf:1 },
  { id:151, brand:'PALL MALL', name:'PALL MALL WHITE MEN 100BX',        sku:'10384497', tier:'GENERIC', storage:1, shelf:0 },
  { id:152, brand:'PALL MALL', name:'PALL MALL WHITE MENTH BOX',        sku:'10414540', tier:'GENERIC', storage:1, shelf:0 },
  { id:153, brand:'PALL MALL', name:'PALL MALL SELECT BX BLUE',         sku:'10677025', tier:'GENERIC', storage:3, shelf:5 },
  { id:154, brand:'PALL MALL', name:'PALL MALL SELECT BX GREEN',        sku:'10677018', tier:'GENERIC', storage:4, shelf:4 },
  { id:155, brand:'PALL MALL', name:'PALL MALL SELECT BX RED',          sku:'10677032', tier:'GENERIC', storage:2, shelf:3 },
  { id:156, brand:'PALL MALL', name:'PALL MALL SELECT 100 GREEN',       sku:'10677674', tier:'GENERIC', storage:3, shelf:5 },
  { id:157, brand:'PALL MALL', name:'PALL MALL SELECT 100 BLUE',        sku:'10677698', tier:'GENERIC', storage:2, shelf:1 },
  { id:158, brand:'PALL MALL', name:'PALL MALL SELECT 100 RED',         sku:'10677699', tier:'GENERIC', storage:2, shelf:3 },
  { id:159, brand:'PALL MALL', name:'PALL MALL BLACK MEN 100BX',        sku:'10384473', tier:'GENERIC', storage:1, shelf:1 },
  { id:160, brand:'PALL MALL', name:'PALL MALL BLACK MENTH BOX',        sku:'10414583', tier:'GENERIC', storage:1, shelf:1 },
  // PARLIAMENT
  { id:163, brand:'PARLIAMENT', name:'PARLIAMENT WHITE 100 BOX',        sku:'10414699', tier:'PREMIUM', storage:1, shelf:0 },
  { id:164, brand:'PARLIAMENT', name:'PARLIAMENT BLUE KS BXFSC',        sku:'10384572', tier:'PREMIUM', storage:1, shelf:0 },
  // PYRAMID
  { id:165, brand:'PYRAMID', name:'PYRAMID NOFILTER BX KS FSC',         sku:'10128950', tier:'GENERIC', storage:1, shelf:0 },
  // SALEM
  { id:166, brand:'SALEM', name:'SALEM GOLD KING BOX',                  sku:'10387894', tier:'PREMIUM', storage:1, shelf:1 },
  { id:167, brand:'SALEM', name:'SALEM GOLD 100 BOX',                   sku:'10387894', tier:'PREMIUM', storage:1, shelf:1 },
  { id:168, brand:'SALEM', name:'SALEM SILVER KING BOX',                sku:'10387900', tier:'PREMIUM', storage:1, shelf:1 },
  { id:169, brand:'SALEM', name:'SALEM SLIM 100 BOX',                   sku:'10418451', tier:'PREMIUM', storage:1, shelf:0 },
  // VA SLIM
  { id:172, brand:'VA SLIM', name:'VA SLIM GOLD 100 BOX FSC',           sku:'10417188', tier:'PREMIUM', storage:1, shelf:0 },
  { id:173, brand:'VA SLIM', name:'VA SLIM GOLD 120 BOX FSC',           sku:'10417218', tier:'PREMIUM', storage:1, shelf:0 },
  { id:174, brand:'VA SLIM', name:'VA SLIM MEN SILVER 120BXFSC',        sku:'10417201', tier:'PREMIUM', storage:1, shelf:1 },
  { id:175, brand:'VA SLIM', name:'VA SLIM MENTHOL 100 BXFSC',          sku:'10559383', tier:'PREMIUM', storage:1, shelf:0 },
  { id:176, brand:'VA SLIM', name:'VA SLIM SILVER 120 BX FSC',          sku:'10417225', tier:'PREMIUM', storage:1, shelf:1 },
  // WINSTON
  { id:181, brand:'WINSTON', name:'WINSTON SELECT KING GLD',            sku:'10397728', tier:'PREMIUM', storage:3, shelf:2 },
  { id:182, brand:'WINSTON', name:'WINSTON SELECT KING RED',            sku:'10418345', tier:'PREMIUM', storage:2, shelf:1 },
  { id:183, brand:'WINSTON', name:'WINSTON SELECT 100 RED',             sku:'10418338', tier:'PREMIUM', storage:1, shelf:2 },
  { id:184, brand:'WINSTON', name:'WINSTON BOX KING BLACK',             sku:'10388764', tier:'PREMIUM', storage:2, shelf:1 },
  { id:185, brand:'WINSTON', name:'WINSTON BOX KING GOLD',              sku:'10388771', tier:'PREMIUM', storage:2, shelf:1 },
  { id:186, brand:'WINSTON', name:'WINSTON BOX KING MTH GREEN',         sku:'10388740', tier:'PREMIUM', storage:1, shelf:0 },
  { id:187, brand:'WINSTON', name:'WINSTON BOX KING WHITE',             sku:'10388733', tier:'PREMIUM', storage:1, shelf:0 },
  { id:188, brand:'WINSTON', name:'WINSTON BOX KING RED',               sku:'10388757', tier:'PREMIUM', storage:1, shelf:0 },
  { id:189, brand:'WINSTON', name:'WINSTON BOX 100 BLACK',              sku:'10418352', tier:'PREMIUM', storage:1, shelf:1 },
  { id:190, brand:'WINSTON', name:'WINSTON BOX 100 GOLD',               sku:'10418543', tier:'PREMIUM', storage:1, shelf:2 },
  { id:191, brand:'WINSTON', name:'WINSTON BOX 100 RED',                sku:'10418536', tier:'PREMIUM', storage:2, shelf:2 },
  // RYO/PAPERS
  { id:193, brand:'RYO/PAPERS', name:'CIG RYO POCKT POHORGL',           sku:'12201969', tier:'PREMIUM', storage:2, shelf:1 },
  { id:194, brand:'RYO/PAPERS', name:'EZ WIDER DOUBLE WIDE',            sku:'12331802', tier:'PREMIUM', storage:1, shelf:1 },
]

function toCtn(packs) { return (packs / 10).toFixed(1) }

function tierKey(t) {
  if (t === 'SUB GENERIC') return 'SUB'
  return t
}

export default function Home() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY)
  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [tierFilter, setTierFilter] = useState('')
  const [collapsed, setCollapsed] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [nextId, setNextId] = useState(300)
  const [form, setForm] = useState({ brand:'', name:'', sku:'', tier:'PREMIUM', storage:0, shelf:0 })

  const brands = useMemo(() => [...new Set(inventory.map(i => i.brand))].sort(), [inventory])

  const filtered = useMemo(() => {
    return inventory.filter(item => {
      if (brandFilter && item.brand !== brandFilter) return false
      if (tierFilter && item.tier !== tierFilter) return false
      const q = search.toLowerCase()
      if (q && !item.name.toLowerCase().includes(q) && !item.sku.includes(q) && !item.brand.toLowerCase().includes(q)) return false
      return true
    })
  }, [inventory, search, brandFilter, tierFilter])

  const groups = useMemo(() => {
    const g = {}
    filtered.forEach(item => { if (!g[item.brand]) g[item.brand] = []; g[item.brand].push(item) })
    return g
  }, [filtered])

  const totals = useMemo(() => {
    const tp = inventory.reduce((s,i) => s + (i.storage||0) + (i.shelf||0), 0)
    const sp = inventory.reduce((s,i) => s + (i.storage||0), 0)
    const sh = inventory.reduce((s,i) => s + (i.shelf||0), 0)
    return { tp, sp, sh }
  }, [inventory])

  function updateCount(id, field, val) {
    setInventory(prev => prev.map(i => i.id === id ? {...i, [field]: parseInt(val)||0} : i))
  }

  function removeItem(id) {
    if (!confirm('Remove this item from inventory?')) return
    setInventory(prev => prev.filter(i => i.id !== id))
  }

  function addItem() {
    if (!form.brand.trim() || !form.name.trim()) { alert('Brand and name are required.'); return }
    setInventory(prev => [...prev, {
      id: nextId,
      brand: form.brand.trim().toUpperCase(),
      name: form.name.trim().toUpperCase(),
      sku: form.sku.trim(),
      tier: form.tier,
      storage: parseInt(form.storage)||0,
      shelf: parseInt(form.shelf)||0,
    }])
    setNextId(n => n + 1)
    setForm({ brand:'', name:'', sku:'', tier:'PREMIUM', storage:0, shelf:0 })
    setShowAdd(false)
  }

  function toggleBrand(brand) {
    setCollapsed(prev => ({ ...prev, [brand]: !prev[brand] }))
  }

  const today = new Date().toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' })

  return (
    <>
      <Head>
        <title>Keith's Superstore #107 — Cigarette Inventory</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* HEADER */}
      <header className="header">
        <div className="header-leopard-bar" />
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-title">🚬 <span>Keith's</span> Inventory</div>
            <div className="header-sub">Keith's Superstore #107 · Pack &amp; Carton Counter</div>
          </div>
          <div className="header-stats">
            <div className="hstat">
              <span className="hstat-val">{totals.tp}</span>
              <span className="hstat-lbl">Total Packs</span>
            </div>
            <div className="hstat">
              <span className="hstat-val">{toCtn(totals.tp)}</span>
              <span className="hstat-lbl">Cartons</span>
            </div>
            <div className="hstat">
              <span className="hstat-val">{inventory.length}</span>
              <span className="hstat-lbl">SKUs</span>
            </div>
          </div>
        </div>
      </header>

      {/* CONTROLS */}
      <div className="controls">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" type="text" placeholder="Search items, SKUs, brands…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className="filter-select" value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
          <option value="">All Tiers</option>
          <option value="PREMIUM">Premium</option>
          <option value="GENERIC">Generic</option>
          <option value="SUB GENERIC">Sub Generic</option>
        </select>
        <button className="btn btn-red" onClick={() => setShowAdd(v => !v)}>+ Add Item</button>
        <button className="btn btn-blue" onClick={() => window.print()}>🖨 Print</button>
        <button className="btn btn-outline" onClick={() => { if(confirm('Reset all counts to zero?')) setInventory(prev => prev.map(i=>({...i,storage:0,shelf:0}))) }}>Reset</button>
        <span className="date-stamp">{today}</span>
      </div>

      <div className="main">

        {/* ADD FORM */}
        {showAdd && (
          <div className="add-form-wrap">
            <div className="add-form-title">+ Add New Item</div>
            <div className="form-grid">
              {[
                { label:'Brand', field:'brand', type:'text', placeholder:'e.g. MARLBORO', list:'brand-list' },
                { label:'Item Name', field:'name', type:'text', placeholder:'e.g. MARLBORO GOLD KS BOX' },
                { label:'SKU / Item #', field:'sku', type:'text', placeholder:'e.g. 10383597' },
              ].map(({label, field, type, placeholder, list}) => (
                <div className="form-field" key={field}>
                  <label>{label}</label>
                  <input type={type} placeholder={placeholder} list={list}
                    value={form[field]} onChange={e => setForm(f=>({...f,[field]:e.target.value}))} />
                </div>
              ))}
              <div className="form-field">
                <label>Tier</label>
                <select value={form.tier} onChange={e => setForm(f=>({...f,tier:e.target.value}))}>
                  <option value="PREMIUM">Premium</option>
                  <option value="GENERIC">Generic</option>
                  <option value="SUB GENERIC">Sub Generic</option>
                </select>
              </div>
              <div className="form-field">
                <label>Storage Packs</label>
                <input type="number" min="0" value={form.storage} onChange={e => setForm(f=>({...f,storage:e.target.value}))} />
              </div>
              <div className="form-field">
                <label>Shelf Packs</label>
                <input type="number" min="0" value={form.shelf} onChange={e => setForm(f=>({...f,shelf:e.target.value}))} />
              </div>
            </div>
            <datalist id="brand-list">{brands.map(b=><option key={b} value={b}/>)}</datalist>
            <div className="form-actions">
              <button className="btn btn-red" onClick={addItem}>Add to Inventory</button>
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* LEOPARD DIVIDER */}
        <div className="leopard-divider" />

        {/* SUMMARY */}
        <div className="summary-bar">
          <div className="sbar-item">
            <span className="sbar-val">{totals.tp}</span>
            <span className="sbar-lbl">Total Packs</span>
          </div>
          <div className="sbar-item">
            <span className="sbar-val">{toCtn(totals.tp)}</span>
            <span className="sbar-lbl">Total Cartons</span>
          </div>
          <div className="sbar-item">
            <span className="sbar-val">{totals.sp}</span>
            <span className="sbar-lbl">Storage Packs</span>
          </div>
          <div className="sbar-item">
            <span className="sbar-val">{totals.sh}</span>
            <span className="sbar-lbl">Shelf Packs</span>
          </div>
          <div className="sbar-item">
            <span className="sbar-val">{toCtn(totals.sp)}</span>
            <span className="sbar-lbl">Storage Cartons</span>
          </div>
          <div className="sbar-item">
            <span className="sbar-val">{toCtn(totals.sh)}</span>
            <span className="sbar-lbl">Shelf Cartons</span>
          </div>
        </div>

        {/* BRAND SECTIONS */}
        {Object.keys(groups).sort().map(brand => {
          const items = groups[brand]
          const sp = items.reduce((s,i) => s+(i.storage||0), 0)
          const sh = items.reduce((s,i) => s+(i.shelf||0), 0)
          const tp = sp + sh
          const isCollapsed = collapsed[brand]

          return (
            <div key={brand} className={`brand-section${isCollapsed?' collapsed':''}`}>
              <div className="brand-header" onClick={() => toggleBrand(brand)}>
                <div className="brand-header-left">
                  <div className="brand-spot" />
                  <span className="brand-name">{brand}</span>
                </div>
                <div className="brand-meta">
                  <span className="btag">{items.length} SKUs</span>
                  <span className="btag storage">📦 {sp}pk / {toCtn(sp)}ctn</span>
                  <span className="btag shelf">🏪 {sh}pk / {toCtn(sh)}ctn</span>
                  <span className="btag total">▸ {tp}pk / {toCtn(tp)}ctn</span>
                  <span className="chevron">▾</span>
                </div>
              </div>

              {!isCollapsed && (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Tier</th>
                        <th className="center" style={{color:'#1B3A6B'}}>📦 STORAGE</th>
                        <th className="center" style={{color:'#D72B2B'}}>🏪 SHELF</th>
                        <th className="center">TOTAL</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => {
                        const total = (item.storage||0) + (item.shelf||0)
                        return (
                          <tr key={item.id}>
                            <td>
                              <span className="item-name">{item.name}</span>
                              <span className="item-sku">#{item.sku}</span>
                            </td>
                            <td>
                              <span className={`tier-badge tier-${tierKey(item.tier)}`}>{item.tier}</span>
                            </td>
                            <td className="count-cell">
                              <div className="count-group">
                                <div className="count-input-row">
                                  <span className="count-lbl">Pks</span>
                                  <input type="number" className="num-input storage-input" min="0"
                                    value={item.storage||0}
                                    onChange={e => updateCount(item.id, 'storage', e.target.value)} />
                                </div>
                                <span className="ctn-sub">{toCtn(item.storage||0)} ctn</span>
                              </div>
                            </td>
                            <td className="count-cell">
                              <div className="count-group">
                                <div className="count-input-row">
                                  <span className="count-lbl">Pks</span>
                                  <input type="number" className="num-input shelf-input" min="0"
                                    value={item.shelf||0}
                                    onChange={e => updateCount(item.id, 'shelf', e.target.value)} />
                                </div>
                                <span className="ctn-sub">{toCtn(item.shelf||0)} ctn</span>
                              </div>
                            </td>
                            <td className="total-cell">
                              <div className="total-packs">{total}</div>
                              <div className="total-ctns">{toCtn(total)} ctn</div>
                              <div className="total-split">📦{item.storage||0} + 🏪{item.shelf||0}</div>
                            </td>
                            <td>
                              <button className="del-btn" onClick={() => removeItem(item.id)} title="Remove">✕</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}

        {Object.keys(groups).length === 0 && (
          <div className="empty-state">No items match your search.</div>
        )}
      </div>
    </>
  )
}
