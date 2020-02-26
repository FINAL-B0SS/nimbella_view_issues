# View GitLab Issues with Nimbella Commander

A Nimbella Commander command set for viewing GitLab project issues.

## Install

```
/nc csm_install github:maljean/nimbella_view_issues
```

## Secrets

```
In order to use this command set you must setup a Personal Access Token on GitLab with API access. And save the token as a secret with the key 'AcessToken_GitLab'
https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html
```

## Usage

```
/<app name> view_issues <status>
```

Supported status parameters:

- `all`
- `opened`
- `closed`
