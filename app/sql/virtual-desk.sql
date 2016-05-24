CREATE DATABASE `virtual-desk`;

CREATE TABLE `activite` (
   `act_id` bigint(20) NOT NULL AUTO_INCREMENT,
   `act_description` varchar(255) NOT NULL,
   `act_titre` varchar(255) NOT NULL,
   `act_version` bigint(20) NOT NULL,
   PRIMARY KEY (`act_id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 CREATE TABLE `corbeille` (
   `crb_id` bigint(20) NOT NULL AUTO_INCREMENT,
   `crb_label` varchar(255) NOT NULL,
   `crb_version` bigint(20) NOT NULL,
   PRIMARY KEY (`crb_id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 CREATE TABLE `dossier` (
   `dss_id` bigint(20) NOT NULL AUTO_INCREMENT,
   `dss_version` bigint(20) NOT NULL,
   `act_id` bigint(20) DEFAULT NULL,
   `crb_id` bigint(20) DEFAULT NULL,
   PRIMARY KEY (`dss_id`),
   KEY `FKn2lbsgrbuoq259o9a6t0gpfjj` (`act_id`),
   KEY `FKqi0bvq4dqwlmx2yeusdmt1nle` (`crb_id`),
   CONSTRAINT `FKn2lbsgrbuoq259o9a6t0gpfjj` FOREIGN KEY (`act_id`) REFERENCES `activite` (`act_id`),
   CONSTRAINT `FKqi0bvq4dqwlmx2yeusdmt1nle` FOREIGN KEY (`crb_id`) REFERENCES `corbeille` (`crb_id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 CREATE TABLE `groupe` (
   `grp_id` bigint(20) NOT NULL AUTO_INCREMENT,
   `grp_nom` varchar(255) NOT NULL,
   `grp_version` bigint(20) NOT NULL,
   `crb_id` bigint(20) NOT NULL,
   PRIMARY KEY (`grp_id`),
   KEY `FKfk4las5hsjmwtxsgjqttdk3sg` (`crb_id`),
   CONSTRAINT `FKfk4las5hsjmwtxsgjqttdk3sg` FOREIGN KEY (`crb_id`) REFERENCES `corbeille` (`crb_id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 CREATE TABLE `utilisateur` (
   `utl_id` bigint(20) NOT NULL AUTO_INCREMENT,
   `utl_login` varchar(255) NOT NULL,
   `utl_password` varchar(255) NOT NULL,
   `utl_version` bigint(20) NOT NULL,
   `crb_id` bigint(20) NOT NULL,
   PRIMARY KEY (`utl_id`),
   KEY `FKd95lkkwg1atdxd86uu36vfmbf` (`crb_id`),
   UNIQUE KEY `utl_login_UNIQUE` (`utl_login`),
   CONSTRAINT `FKd95lkkwg1atdxd86uu36vfmbf` FOREIGN KEY (`crb_id`) REFERENCES `corbeille` (`crb_id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 CREATE TABLE `utls_in_grps` (
   `grp_id` bigint(20) NOT NULL,
   `utl_id` bigint(20) NOT NULL,
   PRIMARY KEY (`grp_id`,`utl_id`),
   KEY `FKpoqfbl8thcvyf8tr0vivv5fdc` (`utl_id`),
   CONSTRAINT `FKe9y54to22ubw4aokjvuj6o1qs` FOREIGN KEY (`grp_id`) REFERENCES `utilisateur` (`utl_id`),
   CONSTRAINT `FKpoqfbl8thcvyf8tr0vivv5fdc` FOREIGN KEY (`utl_id`) REFERENCES `groupe` (`grp_id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;