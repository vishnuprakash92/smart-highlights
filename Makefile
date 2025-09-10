.PHONY: e2e-docker

e2e-docker:
	docker run --rm -v "$(PWD)":/work -w /work mcr.microsoft.com/playwright:focal \
		bash -lc "npm ci && npx playwright test tests/e2e --config=tests/e2e/playwright.config.js"
