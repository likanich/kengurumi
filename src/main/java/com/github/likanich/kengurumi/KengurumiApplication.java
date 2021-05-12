package com.github.likanich.kengurumi;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Kengurumi application base cass
 */
@SpringBootApplication
public class KengurumiApplication {
	private static final Logger logger = LogManager.getLogger(KengurumiApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(KengurumiApplication.class, args);
		logger.debug("Starting Kengurumi application in debug with {} args", args.length);
		logger.info("Starting Kengurumi application with {} args.", args.length);
	}

}
