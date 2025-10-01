-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 01, 2025 at 10:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_edu`
--

-- --------------------------------------------------------

--
-- Table structure for table `annotations`
--

CREATE TABLE `annotations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `book_id` bigint(20) UNSIGNED NOT NULL,
  `page_number` int(11) NOT NULL,
  `annotation_paths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`annotation_paths`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `annotations`
--

INSERT INTO `annotations` (`id`, `user_id`, `book_id`, `page_number`, `annotation_paths`, `created_at`, `updated_at`) VALUES
(18, 1, 50, 4, '[[{\"x\": 215.90778487265635, \"y\": 1676.9330493593216}, {\"x\": 215.90778487265635, \"y\": 1676.9330493593216}, {\"x\": 212.98399644128, \"y\": 1676.9330493593216}, {\"x\": 212.98399644128, \"y\": 1676.9330493593216}, {\"x\": 212.98399644128, \"y\": 1679.8567993593217}, {\"x\": 210.06020800990368, \"y\": 1682.7805493593216}, {\"x\": 210.06020800990368, \"y\": 1682.7805493593216}, {\"x\": 207.13641957852732, \"y\": 1685.7042993593216}, {\"x\": 204.212631147151, \"y\": 1691.5517993593216}, {\"x\": 192.51747742164565, \"y\": 1720.7892993593216}, {\"x\": 186.66990055889295, \"y\": 1735.4080493593217}, {\"x\": 186.66990055889295, \"y\": 1741.2555493593215}, {\"x\": 183.74611212751665, \"y\": 1747.1030493593216}, {\"x\": 183.74611212751665, \"y\": 1752.9505493593217}, {\"x\": 183.74611212751665, \"y\": 1761.7217993593215}, {\"x\": 183.74611212751665, \"y\": 1764.6455493593216}, {\"x\": 186.66990055889295, \"y\": 1767.5692993593216}, {\"x\": 186.66990055889295, \"y\": 1773.4167993593217}, {\"x\": 186.66990055889295, \"y\": 1773.4167993593217}, {\"x\": 186.66990055889295, \"y\": 1776.3405493593216}, {\"x\": 189.59368899026933, \"y\": 1776.3405493593216}, {\"x\": 192.51747742164565, \"y\": 1776.3405493593216}, {\"x\": 192.51747742164565, \"y\": 1776.3405493593216}, {\"x\": 195.44126585302195, \"y\": 1776.3405493593216}, {\"x\": 198.36505428439833, \"y\": 1776.3405493593216}, {\"x\": 201.28884271577465, \"y\": 1776.3405493593216}, {\"x\": 207.13641957852732, \"y\": 1776.3405493593216}, {\"x\": 212.98399644128, \"y\": 1776.3405493593216}, {\"x\": 218.83157330403267, \"y\": 1773.4167993593217}, {\"x\": 224.67915016678535, \"y\": 1773.4167993593217}, {\"x\": 230.526727029538, \"y\": 1770.4930493593215}, {\"x\": 236.3743038922907, \"y\": 1767.5692993593216}, {\"x\": 245.1456691864197, \"y\": 1764.6455493593216}, {\"x\": 250.99324604917237, \"y\": 1761.7217993593215}, {\"x\": 256.84082291192504, \"y\": 1758.7980493593216}, {\"x\": 262.6883997746777, \"y\": 1755.8742993593216}, {\"x\": 265.61218820605404, \"y\": 1752.9505493593217}, {\"x\": 268.5359766374304, \"y\": 1750.0267993593216}, {\"x\": 274.38355350018304, \"y\": 1747.1030493593216}, {\"x\": 277.3073419315594, \"y\": 1744.1792993593217}, {\"x\": 277.3073419315594, \"y\": 1741.2555493593215}, {\"x\": 280.23113036293574, \"y\": 1738.3317993593216}, {\"x\": 283.1549187943121, \"y\": 1732.4842993593215}, {\"x\": 283.1549187943121, \"y\": 1726.6367993593217}, {\"x\": 286.0787072256884, \"y\": 1723.7130493593215}, {\"x\": 289.00249565706474, \"y\": 1720.7892993593216}, {\"x\": 289.00249565706474, \"y\": 1714.9417993593215}, {\"x\": 289.00249565706474, \"y\": 1712.0180493593216}, {\"x\": 289.00249565706474, \"y\": 1706.1705493593215}, {\"x\": 291.9262840884411, \"y\": 1706.1705493593215}, {\"x\": 291.9262840884411, \"y\": 1700.3230493593217}, {\"x\": 291.9262840884411, \"y\": 1700.3230493593217}, {\"x\": 291.9262840884411, \"y\": 1697.3992993593215}, {\"x\": 291.9262840884411, \"y\": 1697.3992993593215}, {\"x\": 291.9262840884411, \"y\": 1694.4755493593216}, {\"x\": 289.00249565706474, \"y\": 1691.5517993593216}, {\"x\": 289.00249565706474, \"y\": 1688.6280493593215}, {\"x\": 289.00249565706474, \"y\": 1685.7042993593216}, {\"x\": 289.00249565706474, \"y\": 1685.7042993593216}, {\"x\": 286.0787072256884, \"y\": 1682.7805493593216}, {\"x\": 283.1549187943121, \"y\": 1682.7805493593216}, {\"x\": 283.1549187943121, \"y\": 1682.7805493593216}, {\"x\": 280.23113036293574, \"y\": 1682.7805493593216}, {\"x\": 277.3073419315594, \"y\": 1682.7805493593216}, {\"x\": 277.3073419315594, \"y\": 1682.7805493593216}, {\"x\": 274.38355350018304, \"y\": 1679.8567993593217}, {\"x\": 274.38355350018304, \"y\": 1679.8567993593217}, {\"x\": 268.5359766374304, \"y\": 1676.9330493593216}, {\"x\": 265.61218820605404, \"y\": 1676.9330493593216}, {\"x\": 262.6883997746777, \"y\": 1676.9330493593216}, {\"x\": 256.84082291192504, \"y\": 1674.0092993593216}, {\"x\": 253.9170344805487, \"y\": 1671.0855493593217}, {\"x\": 248.06945761779605, \"y\": 1671.0855493593217}, {\"x\": 242.22188075504337, \"y\": 1671.0855493593217}, {\"x\": 239.29809232366705, \"y\": 1671.0855493593217}, {\"x\": 233.45051546091435, \"y\": 1668.1617993593215}, {\"x\": 224.67915016678535, \"y\": 1665.2380493593216}, {\"x\": 221.755361735409, \"y\": 1665.2380493593216}, {\"x\": 215.90778487265635, \"y\": 1665.2380493593216}, {\"x\": 210.06020800990368, \"y\": 1665.2380493593216}, {\"x\": 195.44126585302195, \"y\": 1665.2380493593216}, {\"x\": 186.66990055889295, \"y\": 1665.2380493593216}, {\"x\": 174.97474683338763, \"y\": 1665.2380493593216}, {\"x\": 166.20338153925863, \"y\": 1665.2380493593216}, {\"x\": 157.43201624512963, \"y\": 1668.1617993593215}, {\"x\": 145.73686251962428, \"y\": 1674.0092993593216}, {\"x\": 136.96549722549526, \"y\": 1676.9330493593216}, {\"x\": 128.19413193136626, \"y\": 1682.7805493593216}, {\"x\": 122.34655506861358, \"y\": 1685.7042993593216}, {\"x\": 110.65140134310823, \"y\": 1688.6280493593215}, {\"x\": 104.80382448035556, \"y\": 1691.5517993593216}, {\"x\": 96.03245918622656, \"y\": 1694.4755493593216}, {\"x\": 90.18488232347389, \"y\": 1700.3230493593217}, {\"x\": 90.18488232347389, \"y\": 1700.3230493593217}, {\"x\": 84.33730546072121, \"y\": 1706.1705493593215}, {\"x\": 81.41351702934487, \"y\": 1709.0942993593217}, {\"x\": 81.41351702934487, \"y\": 1712.0180493593216}, {\"x\": 75.56594016659221, \"y\": 1720.7892993593216}, {\"x\": 75.56594016659221, \"y\": 1726.6367993593217}, {\"x\": 72.64215173521588, \"y\": 1729.5605493593216}, {\"x\": 72.64215173521588, \"y\": 1735.4080493593217}, {\"x\": 69.71836330383954, \"y\": 1741.2555493593215}, {\"x\": 69.71836330383954, \"y\": 1747.1030493593216}, {\"x\": 72.64215173521588, \"y\": 1758.7980493593216}, {\"x\": 78.48972859796855, \"y\": 1764.6455493593216}, {\"x\": 81.41351702934487, \"y\": 1773.4167993593217}, {\"x\": 84.33730546072121, \"y\": 1779.2642993593215}, {\"x\": 87.26109389209755, \"y\": 1788.0355493593215}, {\"x\": 90.18488232347389, \"y\": 1790.9592993593217}, {\"x\": 96.03245918622656, \"y\": 1793.8830493593216}, {\"x\": 98.9562476176029, \"y\": 1799.7305493593217}, {\"x\": 104.80382448035556, \"y\": 1799.7305493593217}, {\"x\": 107.72761291173192, \"y\": 1802.6542993593216}, {\"x\": 110.65140134310823, \"y\": 1802.6542993593216}, {\"x\": 116.49897820586092, \"y\": 1802.6542993593216}, {\"x\": 122.34655506861358, \"y\": 1802.6542993593216}, {\"x\": 125.27034349998992, \"y\": 1802.6542993593216}, {\"x\": 134.04170879411893, \"y\": 1805.5780493593215}, {\"x\": 139.8892856568716, \"y\": 1808.5017993593217}, {\"x\": 145.73686251962428, \"y\": 1808.5017993593217}, {\"x\": 148.6606509510006, \"y\": 1811.4255493593216}, {\"x\": 151.58443938237696, \"y\": 1814.3492993593215}, {\"x\": 157.43201624512963, \"y\": 1814.3492993593215}, {\"x\": 160.35580467650595, \"y\": 1814.3492993593215}, {\"x\": 163.27959310788228, \"y\": 1814.3492993593215}, {\"x\": 166.20338153925863, \"y\": 1814.3492993593215}, {\"x\": 172.0509584020113, \"y\": 1814.3492993593215}, {\"x\": 174.97474683338763, \"y\": 1817.2730493593217}, {\"x\": 180.8223236961403, \"y\": 1817.2730493593217}, {\"x\": 186.66990055889295, \"y\": 1817.2730493593217}, {\"x\": 192.51747742164565, \"y\": 1817.2730493593217}, {\"x\": 201.28884271577465, \"y\": 1817.2730493593217}, {\"x\": 212.98399644128, \"y\": 1817.2730493593217}, {\"x\": 218.83157330403267, \"y\": 1817.2730493593217}, {\"x\": 227.60293859816167, \"y\": 1817.2730493593217}, {\"x\": 233.45051546091435, \"y\": 1817.2730493593217}, {\"x\": 239.29809232366705, \"y\": 1817.2730493593217}, {\"x\": 245.1456691864197, \"y\": 1817.2730493593217}, {\"x\": 250.99324604917237, \"y\": 1817.2730493593217}, {\"x\": 256.84082291192504, \"y\": 1817.2730493593217}, {\"x\": 262.6883997746777, \"y\": 1817.2730493593217}, {\"x\": 268.5359766374304, \"y\": 1814.3492993593215}, {\"x\": 271.45976506880675, \"y\": 1814.3492993593215}, {\"x\": 277.3073419315594, \"y\": 1814.3492993593215}, {\"x\": 283.1549187943121, \"y\": 1814.3492993593215}, {\"x\": 289.00249565706474, \"y\": 1814.3492993593215}, {\"x\": 297.77386095119374, \"y\": 1814.3492993593215}, {\"x\": 300.6976493825701, \"y\": 1814.3492993593215}, {\"x\": 303.62143781394644, \"y\": 1814.3492993593215}, {\"x\": 309.4690146766991, \"y\": 1811.4255493593216}, {\"x\": 312.39280310807544, \"y\": 1811.4255493593216}, {\"x\": 315.31659153945174, \"y\": 1811.4255493593216}, {\"x\": 315.31659153945174, \"y\": 1808.5017993593217}, {\"x\": 318.2403799708281, \"y\": 1808.5017993593217}, {\"x\": 321.16416840220444, \"y\": 1805.5780493593215}, {\"x\": 324.0879568335808, \"y\": 1802.6542993593216}, {\"x\": 324.0879568335808, \"y\": 1799.7305493593217}, {\"x\": 329.93553369633344, \"y\": 1799.7305493593217}, {\"x\": 329.93553369633344, \"y\": 1793.8830493593216}, {\"x\": 332.8593221277098, \"y\": 1788.0355493593215}, {\"x\": 335.78311055908614, \"y\": 1785.1117993593216}, {\"x\": 335.78311055908614, \"y\": 1779.2642993593215}, {\"x\": 338.70689899046243, \"y\": 1773.4167993593217}, {\"x\": 341.6306874218388, \"y\": 1761.7217993593215}, {\"x\": 344.55447585321514, \"y\": 1758.7980493593216}, {\"x\": 344.55447585321514, \"y\": 1752.9505493593217}, {\"x\": 344.55447585321514, \"y\": 1741.2555493593215}, {\"x\": 344.55447585321514, \"y\": 1735.4080493593217}, {\"x\": 347.47826428459143, \"y\": 1726.6367993593217}, {\"x\": 347.47826428459143, \"y\": 1717.8655493593217}, {\"x\": 347.47826428459143, \"y\": 1709.0942993593217}, {\"x\": 347.47826428459143, \"y\": 1691.5517993593216}, {\"x\": 341.6306874218388, \"y\": 1682.7805493593216}, {\"x\": 341.6306874218388, \"y\": 1671.0855493593217}, {\"x\": 335.78311055908614, \"y\": 1662.3142993593217}, {\"x\": 324.0879568335808, \"y\": 1647.6955493593216}, {\"x\": 306.54522624532274, \"y\": 1636.0005493593217}, {\"x\": 294.8500725198174, \"y\": 1627.2292993593217}, {\"x\": 289.00249565706474, \"y\": 1624.3055493593215}, {\"x\": 283.1549187943121, \"y\": 1621.3817993593216}, {\"x\": 274.38355350018304, \"y\": 1612.6105493593216}, {\"x\": 262.6883997746777, \"y\": 1603.8392993593216}, {\"x\": 253.9170344805487, \"y\": 1600.9155493593216}, {\"x\": 242.22188075504337, \"y\": 1595.0680493593215}, {\"x\": 227.60293859816167, \"y\": 1586.2967993593215}, {\"x\": 218.83157330403267, \"y\": 1583.3730493593216}, {\"x\": 207.13641957852732, \"y\": 1574.6017993593216}, {\"x\": 198.36505428439833, \"y\": 1571.6780493593217}, {\"x\": 189.59368899026933, \"y\": 1568.7542993593215}, {\"x\": 183.74611212751665, \"y\": 1568.7542993593215}, {\"x\": 180.8223236961403, \"y\": 1568.7542993593215}, {\"x\": 177.89853526476398, \"y\": 1565.8305493593216}, {\"x\": 172.0509584020113, \"y\": 1565.8305493593216}, {\"x\": 166.20338153925863, \"y\": 1565.8305493593216}, {\"x\": 160.35580467650595, \"y\": 1565.8305493593216}, {\"x\": 154.50822781375328, \"y\": 1565.8305493593216}, {\"x\": 151.58443938237696, \"y\": 1565.8305493593216}, {\"x\": 145.73686251962428, \"y\": 1565.8305493593216}, {\"x\": 139.8892856568716, \"y\": 1568.7542993593215}, {\"x\": 131.11792036274258, \"y\": 1574.6017993593216}, {\"x\": 125.27034349998992, \"y\": 1577.5255493593215}, {\"x\": 113.57518977448456, \"y\": 1586.2967993593215}, {\"x\": 101.88003604897924, \"y\": 1595.0680493593215}, {\"x\": 87.26109389209755, \"y\": 1603.8392993593216}, {\"x\": 75.56594016659221, \"y\": 1609.6867993593216}, {\"x\": 63.870786441086864, \"y\": 1618.4580493593216}, {\"x\": 52.17563271558152, \"y\": 1627.2292993593217}, {\"x\": 43.40426742145251, \"y\": 1630.1530493593216}, {\"x\": 34.632902127323504, \"y\": 1638.9242993593216}, {\"x\": 28.785325264570833, \"y\": 1644.7717993593217}, {\"x\": 22.93774840181816, \"y\": 1647.6955493593216}, {\"x\": 14.166383107689152, \"y\": 1656.4667993593216}, {\"x\": 11.242594676312816, \"y\": 1662.3142993593217}, {\"x\": 5.395017813560144, \"y\": 1665.2380493593216}, {\"x\": 2.4712293821838074, \"y\": 1668.1617993593215}, {\"x\": -0.4525590491925286, \"y\": 1671.0855493593217}]]', '2025-09-22 08:13:18', '2025-09-22 08:13:18'),
(19, 1, 49, 1, '[[{\"x\":235,\"y\":54.5},{\"x\":234,\"y\":54.5},{\"x\":236,\"y\":57.5},{\"x\":238,\"y\":59.5},{\"x\":250,\"y\":61.5},{\"x\":268,\"y\":61.5},{\"x\":290,\"y\":51.5}],[{\"x\":197,\"y\":62.5},{\"x\":198,\"y\":62.5},{\"x\":203,\"y\":68.5},{\"x\":216,\"y\":88.5},{\"x\":228,\"y\":104.5},{\"x\":238,\"y\":123.5},{\"x\":250,\"y\":137.5},{\"x\":259,\"y\":147.5}],[{\"x\":190,\"y\":86.5},{\"x\":202,\"y\":95.5},{\"x\":229,\"y\":111.5},{\"x\":260,\"y\":140.5}],[{\"x\":156,\"y\":87.5},{\"x\":156,\"y\":85.5},{\"x\":163,\"y\":73.5},{\"x\":182,\"y\":51.5},{\"x\":213,\"y\":14.5}],[{\"x\":178,\"y\":28.5},{\"x\":178,\"y\":29.5},{\"x\":198,\"y\":19.5}]]', '2025-09-24 08:14:21', '2025-09-24 08:14:21'),
(24, 3, 57, 2, '[[{\"x\":27.001091955924686,\"y\":1231.4881104576834},{\"x\":27.001091955924686,\"y\":1226.0879570442344},{\"x\":48.601965520664436,\"y\":1236.8882638711327},{\"x\":81.00327586777406,\"y\":1258.4888775249296},{\"x\":129.60524138843851,\"y\":1263.889030938379},{\"x\":199.8080804738427,\"y\":1263.889030938379},{\"x\":286.2115747328017,\"y\":1263.889030938379},{\"x\":388.8157241653155,\"y\":1236.8882638711327},{\"x\":394.21594255650047,\"y\":1226.0879570442344},{\"x\":399.6161609476854,\"y\":1226.0879570442344},{\"x\":405.0163793388703,\"y\":1253.0887241114806},{\"x\":405.0163793388703,\"y\":1323.2907184863207},{\"x\":405.0163793388703,\"y\":1355.6916389670162},{\"x\":421.21703451242513,\"y\":1371.8920992073638},{\"x\":453.6183448595348,\"y\":1371.8920992073638},{\"x\":502.2203103801992,\"y\":1371.8920992073638},{\"x\":550.8222759008636,\"y\":1312.4904116594223},{\"x\":567.0229310744185,\"y\":1220.687803630785},{\"x\":513.020747162569,\"y\":1204.4873433904372},{\"x\":415.8168161212402,\"y\":1215.2876502173358},{\"x\":313.21266668872636,\"y\":1290.8897980056252},{\"x\":232.2093908209523,\"y\":1393.492712861161},{\"x\":172.806988517918,\"y\":1485.2953208897982},{\"x\":145.8058965619933,\"y\":1555.4973152646382}],[{\"x\":135.00545977962344,\"y\":1577.0979289184352},{\"x\":399.6161609476854,\"y\":1641.8997698798262},{\"x\":410.41659773005523,\"y\":1652.7000767067248},{\"x\":405.0163793388703,\"y\":1663.500383533623}],[{\"x\":216.0087356473975,\"y\":831.8767578624393},{\"x\":216.0087356473975,\"y\":869.677831756584},{\"x\":226.8091724297674,\"y\":945.2799795448735},{\"x\":351.0141954270209,\"y\":1436.6939401687548},{\"x\":442.8179080771649,\"y\":1695.9013040143186},{\"x\":459.0185632507197,\"y\":1744.502684735362}]]', '2025-10-01 01:57:27', '2025-10-01 01:57:27');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `uploaded_by` int(11) NOT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `category_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `description`, `uploaded_by`, `upload_date`, `category_id`) VALUES
(48, 'Economy', NULL, 3, '2025-09-21 07:24:36', 2),
(49, 'Kimia', NULL, 3, '2025-09-21 11:02:40', 1),
(50, 'Health', 'Science', 3, '2025-09-21 19:56:27', 1),
(51, 'Science for life', 'Godmisato Ayato', 3, '2025-09-24 20:56:37', 2),
(54, 'ppp', '123', 3, '2025-09-24 22:49:50', 1),
(57, 'tes2', '123123', 3, '2025-09-30 03:00:25', 1),
(62, '1231123', '12313213123', 3, '2025-10-01 01:50:56', 1);

-- --------------------------------------------------------

--
-- Table structure for table `book_pages`
--

CREATE TABLE `book_pages` (
  `id` int(10) UNSIGNED NOT NULL,
  `book_id` int(11) NOT NULL,
  `page_number` int(11) NOT NULL,
  `page_path` varchar(500) NOT NULL,
  `audio_path` varchar(500) DEFAULT NULL,
  `video_link` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book_pages`
--

INSERT INTO `book_pages` (`id`, `book_id`, `page_number`, `page_path`, `audio_path`, `video_link`, `created_at`, `updated_at`) VALUES
(70, 48, 1, 'book_48/book_pages/page_1.jpg', NULL, NULL, '2025-09-21 07:24:37', '2025-09-21 07:24:37'),
(71, 48, 2, 'book_48/book_pages/page_2.jpg', 'book_48/audio_file/page_2_1758477809.mp3', 'https://youtu.be/URUJD5NEXC8?si=hMTPz3NW1RCF3HLd', '2025-09-21 07:24:37', '2025-09-21 11:03:29'),
(72, 49, 1, 'book_49/book_pages/page_1.jpg', NULL, NULL, '2025-09-21 11:02:42', '2025-09-21 11:02:42'),
(73, 49, 2, 'book_49/book_pages/page_2.jpg', 'book_49/audio_file/page_2_1758477837.mp3', 'https://youtu.be/URUJD5NEXC8?si=hMTPz3NW1RCF3HLd', '2025-09-21 11:02:42', '2025-09-21 11:03:57'),
(74, 50, 1, 'book_50/book_pages/page_1.jpg', NULL, NULL, '2025-09-21 19:56:31', '2025-09-21 19:56:31'),
(75, 50, 2, 'book_50/book_pages/page_2.jpg', NULL, NULL, '2025-09-21 19:56:31', '2025-09-21 19:56:31'),
(76, 50, 3, 'book_50/book_pages/page_3.jpg', NULL, NULL, '2025-09-21 19:56:31', '2025-09-21 19:56:31'),
(77, 50, 4, 'book_50/book_pages/page_4.jpg', NULL, NULL, '2025-09-21 19:56:31', '2025-09-21 19:56:31'),
(78, 50, 5, 'book_50/book_pages/page_5.jpg', NULL, NULL, '2025-09-21 19:56:31', '2025-09-21 19:56:31'),
(79, 50, 6, 'book_50/book_pages/page_6.jpg', NULL, NULL, '2025-09-21 19:56:31', '2025-09-21 19:56:31'),
(80, 50, 7, 'book_50/book_pages/page_7.jpg', NULL, NULL, '2025-09-21 19:56:31', '2025-09-21 19:56:31'),
(81, 50, 8, 'book_50/book_pages/page_8.jpg', NULL, NULL, '2025-09-21 19:56:31', '2025-09-21 19:56:31'),
(82, 51, 1, 'book_51/book_pages/page_1.jpg', 'book_48/audio_file/page_2_1758477809.mp3', 'https://youtu.be/URUJD5NEXC8?si=hMTPz3NW1RCF3HLd', '2025-09-24 20:56:42', '2025-09-25 05:47:37'),
(83, 51, 2, 'book_51/book_pages/page_2.jpg', NULL, NULL, '2025-09-24 20:56:43', '2025-09-24 20:56:43'),
(84, 51, 3, 'book_51/book_pages/page_3.jpg', NULL, 'https://youtu.be/URUJD5NEXC8?si=hMTPz3NW1RCF3HLd', '2025-09-24 20:56:43', '2025-09-25 05:48:22'),
(209, 54, 1, 'book_54/book_pages/page_1.jpg', NULL, 'https://youtu.be/URUJD5NEXC8?si=hMTPz3NW1RCF3HLd', '2025-09-24 22:49:51', '2025-09-25 05:50:19'),
(241, 57, 1, 'book_57/book_pages/page_1.png', NULL, 'https://youtu.be/_ORqqctGaXk?si=8VuLnxhNgGLiHXsl', '2025-09-30 03:00:29', '2025-09-30 03:01:34'),
(242, 57, 2, 'book_57/book_pages/page_2.png', NULL, NULL, '2025-09-30 03:00:32', '2025-09-30 03:00:32'),
(243, 57, 3, 'book_57/book_pages/page_3.png', NULL, NULL, '2025-09-30 03:00:35', '2025-09-30 03:00:35'),
(256, 62, 1, 'book_62/book_pages/page_1.png', NULL, NULL, '2025-10-01 01:51:01', '2025-10-01 01:51:01'),
(257, 62, 2, 'book_62/book_pages/page_2.png', NULL, NULL, '2025-10-01 01:51:04', '2025-10-01 01:51:04'),
(258, 62, 3, 'book_62/book_pages/page_3.png', NULL, NULL, '2025-10-01 01:51:07', '2025-10-01 01:51:07');

-- --------------------------------------------------------

--
-- Table structure for table `book_toc`
--

CREATE TABLE `book_toc` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `book_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `page_number` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book_toc`
--

INSERT INTO `book_toc` (`id`, `book_id`, `title`, `page_number`, `created_at`, `updated_at`) VALUES
(1, 49, 'Chapter 1: Intro', 1, '2025-09-21 11:41:26', '2025-09-21 11:41:26'),
(3, 50, 'Chapter 4: War', 6, '2025-09-22 04:54:24', '2025-09-22 04:54:24'),
(4, 57, 'Chapter 1 sadasdasdsad', 1, '2025-09-30 03:01:34', '2025-09-30 03:01:34');

-- --------------------------------------------------------

--
-- Table structure for table `book_user_access`
--

CREATE TABLE `book_user_access` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `book_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book_user_access`
--

INSERT INTO `book_user_access` (`id`, `user_id`, `book_id`, `created_at`, `updated_at`) VALUES
(10, 1, 49, '2025-09-24 22:30:28', '2025-09-24 22:30:28'),
(11, 1, 50, '2025-09-24 22:30:28', '2025-09-24 22:30:28'),
(12, 1, 57, '2025-10-01 01:49:09', '2025-10-01 01:49:09'),
(13, 1, 54, '2025-10-01 01:49:46', '2025-10-01 01:49:46');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Science', NULL, '2025-09-21 11:11:41'),
(2, 'Social', '2025-09-21 11:10:53', '2025-09-21 11:10:53');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_30_040840_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(48, 'App\\Models\\User', 1, 'auth_token', 'ac0308a399d4570cd9af987382904d5e77e9603006ed54298915c1b20e65a139', '[\"*\"]', '2025-10-01 01:56:28', NULL, '2025-10-01 01:47:44', '2025-10-01 01:56:28'),
(49, 'App\\Models\\User', 3, 'auth_token', 'acbf8c522b310451be4048abc9557d73f730f5e0598fb5ea984470c79ab4aca2', '[\"*\"]', '2025-10-01 01:57:27', NULL, '2025-10-01 01:48:41', '2025-10-01 01:57:27');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0IlfDICrS6xlADGX8suhWgLa8I0RX3PCB6c62BDa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVWF0WDRTelczc3dQVU5BTERic3pRMmFRc3lHVkVKb1hYWXBUZnBlbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518681),
('1xoLao1YlUwFZiB7lqaWklt43XmSiodLUd0Adxnn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU2RIeE9Xclltd0cwZjZ1MER0dHYwWEtRQnNraW1Ha3lXTExWb2NtOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518887),
('2d91YVccjVSU2ivZ2xPVO6EA8aaLlcJd0FO0Jew3', NULL, '127.0.0.1', 'PostmanRuntime/7.46.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN1JHeWRxelRqY3d5SjZ3dG9HVzYzWE01dnpJZXRHdXhIbFBiYjhJSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1758440717),
('2Yiv8S2wOGhOWEz9aA4F56CueACUuIfh9g0llBto', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRmtZbWJ4T3hxdEIzMUZWU2pWczMzRVhpTGFyelU1OGRKZlBMRjQxdSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvc3RvcmFnZS9ib29rXzQ5L2Jvb2tfcGFnZXMvcGFnZV8xLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1758507793),
('4Pxk8ZkweKtAKcrmsnFhqQuOsfvQmprg1WHihBXp', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN0sxTzZkUXEwUXVOSmNOR3ZISmR1c0wybGpDdTVmR3AwVW4xMlpSbyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518712),
('5F0naYjTOODlawm1sVTMuUK8L6zLqLWMBP2ZYF0E', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVEVTN0NSNXlWTDkxRTR0YVFSVUlZbkZUa2hwSFdqc3FLa1ZjSUFyUSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518638),
('5QmqAOQXPzqcHGk080qaEh4t0rcEfQjIS1MAsntM', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicXJ4UEs0MjlRSzM5eFpsWlN6eVZ3b040dXRlQ1U3bmk4OGtjM1JDciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518637),
('7TyYePevjYIykSzkRO7g0IRr9somUlzSKGXT2oXE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibmhTMFREQ1lYeHh3U1EwNEN0TU56T0c3NFVwNXdaY3JXR1dwMUZYOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519478),
('bNFKyNZhvtDgzlw6bFOObsJY4qk78LXu9bvyrEaR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiazF6Rm1JWEV3aDl5MER2OWFrWFNINTJMT3pUeHZaT2JYdUpON3FiQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519814),
('BrxDMWppf1wmzv7VkiEgyyoGHjyGHdN1BR3ogObr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiazV4Nk11eVhjd0hwNDZGSm50OGhMWE5weXNiRjNBbGVMZVhteFNHSyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518561),
('bueSc7Yq1lYoyX61LVfjrAYKwgAZkiapUGIHxo64', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicHlSUEdDTXFkakNUVmh4dzc1aXY4WEZVa1NqRG1KZzV6RFhnSm4wTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518636),
('CnAgECIHdgGvAHuw22C9JMpd6gKPkti4WTvvqVlb', NULL, '127.0.0.1', 'PostmanRuntime/7.46.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR2JJN2dkM0p2eWF1c2J4TlJVRmcxdElhVmkyRkJRR2tNSlk2SVc4ZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvNDkvdG9jIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758479700),
('CNXQPe48ZDxOtVUbYTh9cafuT7pjzUh0LQx7FkEn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSmc2NHk2cHJvejM0emp3T3ZRM0FOeHNYbnM4djNXVW1GU0JjYldXZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518560),
('EQOyHP14ETiH6a6ZDW3GnLaO33lefR4BMnDN6Oet', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiejVSYks2U1FCdURFVUFVbzEzU2N3ZlBWOGUyTjRiajdMWWFzMFY1aiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519034),
('fDv2ieZKr7WE2UWJD2XExYjE8uuscWW9ai5ZB0ko', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibXd0RFpVbFBuSDRGa2U2dFcybm1mMHBidEJiUWxaUmxTMnFteEZFZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hc3NldHMvaW5kZXgtRFdrbjhpck8uanMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1758519519),
('FVT9EkFPwcVyHJfCQgBLbUYOUa2Maiwif5jB8tVk', NULL, '127.0.0.1', 'PostmanRuntime/7.46.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSTlUeUI2a0JDa1JHaU0xR1hjZXNPY3RqdEV4Y0VFTXJrSGlKVG9RSyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1758461061),
('hg67uOkPedXhf0zjFmRm0SAMg9a3kjajEc5audKU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ051TmNiZW9aS3hqOWthY3l4ZThMWWtZOFhqczhST2xnRXBVcUMwdiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518887),
('hr31K97kVuStV77dPLJNrzaqH8ACyDHSXuaRWzkt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiam5SdVlhOG9OUG12Mjd2ZlN5VFRaSTJOR3ZPQ2ZWeFgzamVEaFFPdCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518711),
('Iz16EXvSBlxC2Smxc9xFKVJcByD8SSztuJXJFEZ8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRUlDU01Fbjd0dFJiaHI1eG9SdVhvN1ozUU44Z1FoRGlIS3dqYXBtSiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hc3NldHMvaW5kZXgtREgwLVJUQXcuY3NzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519519),
('j0fkMBVy5Bm9C0MG2pXWgSslfFlOjK57whef3oHQ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY3lHRU5RRlhJdzc1OHl0dXR5SWFQYWVGb3BJYXk4VVBvUEhJZGFJSSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518672),
('j92JySN8yH0dm59kEut2sgIFQjJL0ZjjreMznGgJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSXRRaGV4ekprd0d1Z1BtRVdNdHl5VFIzMEJ3ZFdzT2FHNndUNHY0MyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hc3NldHMvaW5kZXgtRFdrbjhpck8uanMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1758444862),
('jIqMYZTu7S5rV7D577pukr7brCAC8Pb8J09DHDKp', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUFV1ZkZyQzB2ajFOMjJZUkJxYWhyakl2R0ZjTDFpZ0gyazhPeUVFcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518749),
('jppWXUXsWUlZlBx4fwAZH13WxPvxlTD54PjU3mHC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUFBEQjBxaHZsZGc4ZzdORVRRVmg5MVRnaUVad3ZsT0FuOEVaTGo3OSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519478),
('kECS0DKhdfUE4oWmIJrGyOU9HLqwKY5ZYEyPFypa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMFRjREZtTmExRmR3ZmVRNWlEcUZKZXJaR1ZYYXlzelB4b3pwT2tVcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTk6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518364),
('KsYh1b2eNEBLvQSPZvMxwTHxmKrMidW48jnbF1EA', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYUo5TzlmejVUTWxRN1VtMks4T2FJdTU2ZmxrSkhJa2xtcmtHVkQyWiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518711),
('ljOyKTu68jylmtL5ciWpqX1xi6EgMh09w2qMEk6D', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSDdlWWpBaGViQWR6N1FpU0VlczRWUDVnMHlJZEFodnZNa1JMU1hoMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTk6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518356),
('LrTxrUDzjlkY75nNPSa9e3DkRugYp6d2sZ1p8Ar5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSTNzbThGMXhTRkdRa1FGN3Z3Sk5obXdCQUExQmJMTVh5TXBEWDNZMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTk6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518131),
('LZ09X1JB5dY76KQiEMaUCVB2LYTxTpXWurPjnsur', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicUJ1ZlpaWThxeTJxeHdYSGhtaEpJMnM5NDhhdUJld0xRNlpDRlRQOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519768),
('MtxDP2gio3S9Ji1BHyRB50Iqh8X04w6YHna6OPXJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTzg5Y0IwQXFhaEROYTlsbWk3YVdERjJmb0lmVHE2OGJINlJKUmRWZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518550),
('NjqVP5oEe2REua76jLwxkFJe7YuzIzrvYzrHpr0L', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibUg0RWVIcFBCcG1haldPcEZxQ2pYTVUyTWRPMWw0S1NNRUJlU0EzWiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518561),
('O7VHpRpZDmvK96RAwRr0Jiu1KL6G3zuP8D1oYnhm', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidWpzcWhUNDlPc1pRbm5nNEVMQ3VPR1B4TTU1NVNUNHB4Umk5UHk3biI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hc3NldHMvaW5kZXgtRFdrbjhpck8uanMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1758519798),
('oCUuiitzWGRF8NkE402I6ie8e023mkDpxfLC14gT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib3hza2dqeHdYNERBUjVMYkRQVzlFYUV2WVRXbGF2dHI4WHhmbmdkZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519814),
('p8A5G5cBQ3k388KFF07YUwQLbxfIxKwpMdvcAxhR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTU9ZSlRnZ2JNWnJBV0tBVU9sQVJHM1VmZlBLVmlmU01Pb1dUVlBVSiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518749),
('pBMHLeuCF74h2StrUgFqfzo9HSmv1eFzw8tfkbNg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiajhRck9tYlZMeEtYNkVsSjlQdlZWMVJNenVzOXpMcjZYTmVIMHZDUSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519370),
('qb4Dvf0UDATilGIPyTrD3LOekEuFVThukOJ2beUH', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS2dPbXE0dzE5bHJMdHkxVDlWck9LaE9ETlhiQ2F6NUg5WU9zZHhweCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvc3RvcmFnZS9ib29rXzQ4L2Jvb2tfcGFnZXMvcGFnZV8xLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1758507793),
('Qlxwvpkdb0J4ko0oUIq6l08q7z1ZejXgux9QmaPl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSHQ5ejA5RWI5OTd4M0k4U0Y0MnBKa1JVcUpQa1NuRnBBTkRQQk5WbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518550),
('RS8df4m8JxYbs5J63e38W8ktnx9fLnA9QcCIZGF6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNEFEWG83cXZnWklVNGZncnZMQ0NzRFdZSHFzRzdFdmRQOWZJejB1eCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518638),
('ScJHSsXLlIVNo7JwMDAzB8qM7hMI3TfRGG13pIdi', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibE1OcUs3d0RESVdaenJSWGZlMzZIeE1aNUNpa0dPZGU3U3h0eUt0OCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519266),
('SR0PCyXWcLfe7mRSyvc1FDycslhZZak6ytnTpQzv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVkFSOGdaUE1XTmxweXBRTVRSUUM5NlNreXRpQTV6RHNLcHZ1UUQ2cyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518681),
('tIS7F6xVylTXSWNpO6A2VEIc6wBbxPDkJxqWTCNq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSXRrQ21LT1ptTncxYXVESFBUVUl4Uzg3RG95MUxCcXVrNEsyMmFadCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519163),
('tuzs8iZcKAtB1YzYrimsyjwDsgIfzOJ8pZnteU2S', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS2JrbVkwemFXdzF2SFQzRTcxRWtsQ0lrT0JDdjRoSDVoV29NdWpMOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTk6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518224),
('Ug0Pu1XLjCVn02eNXhqbkSrmliRzlCjhymtSkYJ9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDJKTXZncjF2Y0R1cGJYVnFzMFN2VkNnclVOV29LUDBhVURUalBZNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519163),
('UKrYqmjAtAeBle9kM66d9ZumdsoaEO99cqMizgIj', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUE9OWnVtc2tTc3VKNk5TTTM5Vjh3WDZMU2JGVHg1TkMxUWZOcm1GbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519371),
('UpibDE3U0RaTHSkBy67K0p3cjJZOQ6QpUIqpdoSW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicm1BZFVPMkM5bmR5b21ZZ2xoODBjS2tsTk5rR2p5Nm9HSDZEODNWMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518711),
('v1Cscz92RaWABkqolbKJ4IiISiOpwAdAnDut32O6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidVFQcjNGWG4zSlhyUmpYTlZIVlN6Qm5nZDV1SE9MSHpZekVKbkFleiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519034),
('wIEVm0icjr3INOqv9LfyV0jC3I2fiA5a0ifegcYR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibmFQQTVKNmEyYUFkbU5qbWptandsWkw4SFN6ME1PZmV4TXNrWU1YQSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518749),
('xAESDNxCQBQ8UXuRmUQPE3mW1lVUyyltrYic4dRz', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMkdObUxweG5oRzFPc3ZRMEl5RHNIRDlld0FoQVd1NWp0dzBnT0NCOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519768),
('xEoJy3ntFjQdEbJsodYk4IZe4nb9ZlvbCjFgYt5w', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieFRoZDFXblhkYjl2cGZVZmlocDdoNHBNYnM0YUNzSmQ3M2RBZjVIdiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518878),
('XFF07CJqso2gqVA8QKywL3EJZMezez1dm5cVKN3F', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNWo0Rlh1aE9ydVFSQ0FXZTRBdDFieWYyYlBZVUpXY0prdklaNmtyeCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518672),
('xGrJwWV1Rt32NkrUq7Du6ISoswpKO53N51mLyp4O', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSFljUThrQWNRZHRjbmF1eVR0Y28zTk9WU2J6VjlQNGxwMWlYU0xLZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518749),
('y2DCtoHuYWdupGcvoWAuvpY1H9iUUfkwIneAxbYI', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYjRyUEhYSjY2TnBIb1I3Q1dndGM1SlpRRG1keTZUQzNJa3FISDdZOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758518560),
('ZKwoHQ5hqzMItfACVJcqPHJpSxLw4GQX11GJ6Sp7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY0VEa1F2YTA5b1ByTlg4TjBiR056WXF0MDQ0c3hEaGtyWmxodDdWbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYm9va3MvYXVkaW8vNDkvcGFnZV8yXzE3NTg0Nzc4MzcubXAzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1758519266);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` enum('admin','student','teacher') NOT NULL DEFAULT 'student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`) VALUES
(1, 'Ahmad Nadhif', 'ahmadnadhif@gmail.com', NULL, '$2y$12$cR3yj2tN.kj8XHIp.9Nq3.sP7jMoc8olS6H63pFVwLvfM7YnbXrtK', NULL, '2025-09-21 00:07:38', '2025-09-21 00:07:38', 'student'),
(3, 'Iko Indra', 'ikoindra@gmail.com', NULL, '$2y$12$nucX4gP6JYUs1Utze2mrpupNzkVSoXSLLkKYMgIYiaLZyTwbRhzs6', NULL, '2025-09-21 00:38:35', '2025-09-21 00:38:35', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `annotations`
--
ALTER TABLE `annotations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_book_page` (`user_id`,`book_id`,`page_number`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `idx_annotations_user_book` (`user_id`,`book_id`),
  ADD KEY `idx_annotations_page` (`page_number`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_books_category` (`category_id`);

--
-- Indexes for table `book_pages`
--
ALTER TABLE `book_pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `book_toc`
--
ALTER TABLE `book_toc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_book_toc_book` (`book_id`);

--
-- Indexes for table `book_user_access`
--
ALTER TABLE `book_user_access`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_book_unique` (`user_id`,`book_id`),
  ADD KEY `fk_access_book` (`book_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `annotations`
--
ALTER TABLE `annotations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `book_pages`
--
ALTER TABLE `book_pages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=259;

--
-- AUTO_INCREMENT for table `book_toc`
--
ALTER TABLE `book_toc`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `book_user_access`
--
ALTER TABLE `book_user_access`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `annotations`
--
ALTER TABLE `annotations`
  ADD CONSTRAINT `annotations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `annotations_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `fk_books_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `book_toc`
--
ALTER TABLE `book_toc`
  ADD CONSTRAINT `fk_book_toc_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `book_user_access`
--
ALTER TABLE `book_user_access`
  ADD CONSTRAINT `fk_access_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_access_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
