# Terraform notes for AI provider keys

Acest folder este exemplu de migrare spre Terraform. Nu rula `terraform apply` peste resurse create deja de CloudFormation fara o decizie clara:

- creezi o stiva noua administrata de Terraform; sau
- importi resursele existente in Terraform state.

## Directia recomandata

1. Frontend ramane in Amplify.
2. Lambda/API Gateway pot fi mutate ulterior in Terraform.
3. Cheia AI nu se pune direct in Git si ideal nici direct in `environment`.
4. Cheia se tine in AWS Secrets Manager, iar Lambda primeste doar ARN-ul secretului.

Providerii ganditi in exemplu sunt:

| Provider | `ai_provider` | Exemplu `ai_model` |
| --- | --- | --- |
| Gemini | `gemini` | `gemini-2.5-flash` |
| OpenAI | `openai` | `gpt-4.1-mini` |
| Anthropic | `anthropic` | `claude-sonnet-4-20250514` |
| OpenRouter | `openrouter` | `google/gemini-2.5-flash` |

## Remove cheia veche din AWS

Pentru stack-ul actual CloudFormation, foloseste `../cloudformation-ai-proxy.yaml` si seteaza parametrul `AiProviderApiKey` gol sau cu o cheie noua. Apoi verifica in Lambda ca nu mai exista `GEMINI_API_KEY`.

Pentru Terraform, modelul este:

```hcl
environment {
  variables = {
    AI_PROVIDER            = var.ai_provider
    AI_MODEL               = var.ai_model
    AI_PROVIDER_SECRET_ARN = aws_secretsmanager_secret.ai_provider_key.arn
    ALLOWED_ORIGIN         = var.allowed_origin
  }
}
```

Secretul se creeaza separat si se actualizeaza fara sa il pui in Git:

```bash
terraform apply -var="ai_provider_api_key=..."
```

Important: variabilele `sensitive` nu se afiseaza in terminal, dar pot ajunge in `terraform.tfstate`. Pentru productie, preferabil setezi secretul manual in AWS Secrets Manager sau prin pipeline securizat, nu din laptop.

Ca sa opresti temporar AI-ul din Terraform, scoti `AI_PROVIDER_SECRET_ARN` si orice `AI_PROVIDER_API_KEY`/`GEMINI_API_KEY` din environment-ul Lambda. Cheia din Secrets Manager poate ramane pentru mai tarziu, dar Lambda nu o va mai putea folosi daca nu ii dai ARN-ul si permisiunea `secretsmanager:GetSecretValue`.
