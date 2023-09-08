.PHONY: test compose-init

test:
	@docker-compose -f docker-compose-test.yml down
	bash build/setup_vault_gha.sh docker-compose-test.yml vault-test
	@docker-compose -f docker-compose-test.yml up --build --abort-on-container-exit
compose-init:
	bash build/setup_vault.sh
	@docker-compose up -d --build