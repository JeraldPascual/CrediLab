# Project Overview: CrediLab

## Theme
**"Innovating Today for a Sustainable Tomorrow"**

## Mission
CrediLab is a decentralized coding assessment platform designed to democratize access to tech careers. It allows students to prove their skills through practical coding challenges, earn credits from a shared pool, and receive wallet-linked credentials for verification.

## Problem Solved
- **Inequity:** Traditional certifications are expensive.
- **Trust:** Resumes can be faked.
- **Access:** Many assessment platforms are heavy and require high-end devices.

## The Solution
A lightweight, mobile-responsive web app where users:
1. Solve coding problems (Java/Python) in a secure, monitored environment.
2. Pass verification tests via the Judge0 Execution Sandbox.
3. Earn credits from a shared pool as tamper-proof proof of competence, with wallet-linked credentials for verification.

## Security & Integrity (The "Red Team" Layer)
To ensure the value of our credentials, we implement a multi-layered defense:
- **Behavioral Analysis:** Keystroke velocity and focus tracking detect non-human typing patterns.
- **Sandboxed Execution:** All code is securely compiled via Judge0 API (Docker), isolating it from the client.
- **Immutable Trust:** Completion proofs are linked to wallet addresses with code hashes stored in Firestore, creating an auditable credential trail that cannot be faked.

## SDG Alignment
**SDG 4: Quality Education**
- **Target 4.4:** Increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment, decent jobs, and entrepreneurship.
- **Impact:** Provides free, accessible skill verification for students on low-end devices.

**Digital Inclusion (Technical Implementation)**
- Optimized for 3G networks and devices with low RAM (2GB).
- "Lite Mode" ensures sustainability by reducing energy/data consumption.
