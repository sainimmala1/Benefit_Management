-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: db_benefits
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `benefits`
--

DROP TABLE IF EXISTS `benefits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `benefits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `benefit_name` varchar(45) DEFAULT NULL,
  `description` text,
  `eligibility_criteria` text,
  `coverage_amount` decimal(10,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2324 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `benefits`
--

LOCK TABLES `benefits` WRITE;
/*!40000 ALTER TABLE `benefits` DISABLE KEYS */;
INSERT INTO `benefits` VALUES (1,'Health Insurance','Covers medical expenses','Full-time employees',5000.00,'2024-07-26','2024-08-24'),(2,'Life Insurance','Provides life insurance coverage','All employees',20000.00,'2024-01-01','2024-12-31'),(3,'labour Insurance','life insurance coverage','All employee',10000.00,'2024-08-31','2024-09-03'),(4,'Paid  Time Off','Vacation Day','Part Time',7000.00,'2024-08-23','2024-08-22'),(20,'labour Insurance','Provides life insurance coverage','Part Time',6000.00,'2024-08-12','2024-09-06');
/*!40000 ALTER TABLE `benefits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_requests`
--

DROP TABLE IF EXISTS `user_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `action` enum('add','update','delete') NOT NULL,
  `benefit_id` int NOT NULL,
  `benefit_name` varchar(45) DEFAULT NULL,
  `benefit_description` varchar(255) DEFAULT NULL,
  `eligibility_criteria` varchar(45) DEFAULT NULL,
  `coverage_amount` varchar(45) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('pending','approved','denied') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `info` varchar(900) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_requests`
--

LOCK TABLES `user_requests` WRITE;
/*!40000 ALTER TABLE `user_requests` DISABLE KEYS */;
INSERT INTO `user_requests` VALUES (51,'user@22','add',5,'labour Insurance','Provides life insurance coverage','All employees','5600','2024-08-28','2024-09-06','pending','2024-08-20 18:30:00','kindly add admin'),(52,'user@22','update',1,'Health Insurances','Covers medical expenses','Full-time employees','5000.00','2024-07-27','2024-08-25','denied','2024-08-20 18:30:00','kindly update admin'),(55,'user@22','delete',4,'Paid Time Off	','Vacation days	','All full-time employees	','20000.00','2024-08-18','2024-08-18','denied','2024-08-20 18:30:00','Admin Kindly delete this'),(56,'user@22','add',10,'Policy','Kind of Insurance','All employees','90000','2024-08-22','2024-08-30','denied','2024-08-20 18:30:00','Admin Kindly add this'),(61,'gradious@gmail.com','add',20,'labour Insurance','Provides life insurance coverage','Part Time','6000','2024-08-13','2024-09-07','approved','2024-08-20 18:30:00','kindly add this admin'),(62,'gradious@gmail.com','update',4,'Paid  Time Off','Vacation Day','Part Time','7000.00','2024-08-22','2024-08-21','denied','2024-08-20 18:30:00','kindly update ');
/*!40000 ALTER TABLE `user_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@example.com','$2y$10$QyA4Z8T0tUeKle3UozWo1OpV0lC8ZZ7tBktz.fuEKfTcZXxU7tAqG','admin','2024-08-18 07:36:13','2024-08-18 07:36:13'),(2,'user1@example.com','$2y$10$hW/V1WXxxpXp.PvZ.JHH3OBN5/U.kc5TEQdFxl8m6WtR4VrMzMHSy','user','2024-08-18 07:36:13','2024-08-18 07:36:13'),(22,'user@22','$2b$10$gDMlWUVGgaXUqDoj55XXUeZXEKWr1N6/jMD/etBOhxGCiKx29Li4i','user','2024-08-19 09:30:41','2024-08-19 09:30:41'),(23,'admin@22','$2b$10$TM6if0PLQQFi3NKHT4EC3OF3aAyOn0lFZAfAkaSPBXVREOWScnSwK','admin','2024-08-19 09:32:02','2024-08-19 09:32:02'),(24,'admin@33','$2b$10$Jz8j.hBejfUa3azBdQCbM.2HqOwnvZtd0cgt/k94ZK85H3BcEjKYG','admin','2024-08-20 13:45:37','2024-08-20 13:45:37'),(25,'admin@44','$2b$10$r1PW0BEEp5pDUAoLigdDI.bzQfEcvFNx0mrhZMC00slLH2sCk4df6','admin','2024-08-20 19:52:50','2024-08-20 19:52:50'),(26,'user@33','$2b$10$s8QZP.N7ww4sqT1kfkARZO/uqaL9RQ2rsqwwDPaqjufxc4yPyU/da','user','2024-08-20 19:54:56','2024-08-20 19:54:56'),(27,'user@gmail.com','$2b$10$WQvSycZWvZlh0RquoCxlK.igjra8DuvTMfHdxFSBRlg7LRUvS10dG','user','2024-08-20 20:53:49','2024-08-20 20:53:49'),(28,'user@222','$2b$10$kEsNyEBn.3dmXWOA5wxYBeriWMd0RBCM/S2CGTxSktewSf8UOGNCu','user','2024-08-21 09:28:49','2024-08-21 09:28:49'),(29,'admin@222','$2b$10$ITMpNUVbHGtnW62dOPUVb.AkqTcKqe/uQwyLzdxWd2AnDrNrWDLle','admin','2024-08-21 09:59:12','2024-08-21 09:59:12'),(30,'gradious@gmail.com','$2b$10$YaX85YH2qWAfgtcyjXi/nuIWnhIkRo8W8Hlb1bOKd7lRnZI2KMjAK','user','2024-08-21 13:26:55','2024-08-21 13:26:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-21 19:09:47
