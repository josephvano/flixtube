.PHONY: up
up:
	docker-compose up


.PHONY: reboot
reboot:
	docker-compose down && docker-compose up --build
