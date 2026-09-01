# AI and digital tools

Choose a tool for a specific task. The Gate pages explain what your team must produce.

## Tool map

| Need | Resource | Gate | Use it for |
| --- | --- | --- | --- |
| Explore a topic or question assumptions | [HKU GenAI](https://genai.hku.hk/) | 01 to 06 | Search terms, explanations, critique and draft review |
| Read SDG goals and targets | [UN SDGs](https://sdgs.un.org/goals) | 01 | The official goal and target wording |
| Find academic sources | [Google Scholar](https://scholar.google.com/) and [HKU Libraries](https://lib.hku.hk/) | 01 to 03 | Papers, reviews and technical sources |
| Find Hong Kong public data | [DATA.GOV.HK](https://data.gov.hk/en/) | 02 and 05 | Local baseline or comparison data |
| Learn from papers, datasheets, notes or a repository | [DeepTutor](https://github.com/Active-Learning-Kyle/DeepTutor) | 02, 04 and 05 | A local learning workspace for source-based questions, research, visualisation and practice |
| Record tasks and decisions | [GitHub Issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues) | All | Assumptions, tasks, failures and decisions |
| Store versions and evidence | GitHub repository | All | Project files, history and evidence links |
| Write and review code | GitHub Copilot Student | 04 to 06 | Bounded coding tasks that the team tests and explains |
| Analyse test data | Python, Jupyter or a spreadsheet | 05 | Repeatable calculations, plots and comparisons |
| Publish reusable work | GitHub README, licence, release and Pages | 06 | Documentation and a named public version |

## DeepTutor

Use DeepTutor when the team needs to understand technical material before making a decision. Useful tasks include:

- ask questions across selected papers, datasheets or project documents;
- study an unfamiliar open-source repository before adapting it;
- create explanations, visualisations or practice questions from the material;
- compare what the documents say with the team's current understanding.

DeepTutor is optional and requires local setup plus a model provider. Check its README before installing it. Keep original source links in the repository, verify answers against those sources and do not upload restricted project material to an external model provider.

## Give AI a bounded task

Include:

1. the current Gate and decision;
2. relevant project context;
3. the evidence already available;
4. the required output format;
5. what the tool must not invent or decide.

Example:

> We are at Gate 02. Our current stakeholder is [stakeholder] in [context]. Identify claims in our problem statement that need evidence. For each claim, suggest an evidence type and a way it could be disproved. Do not invent sources, interviews or data.

## Stop prompting when

- the answer depends on a real stakeholder or local observation;
- a measurement or test can resolve the question;
- the tool cannot lead you to an original source;
- the team cannot explain or test the generated code;
- privacy, safety, ownership or consent is uncertain.
