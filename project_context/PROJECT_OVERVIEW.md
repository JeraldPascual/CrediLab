# Project Overview: CrediLab

## Theme
**"Innovating Today for a Sustainable Tomorrow"**

## Mission
CrediLab is a decentralized, blockchain-verified coding assessment platform designed to democratize access to tech careers. It allows students to prove their skills through practical coding challenges and receive tamper-proof, on-chain credentials (NFTs/SBTs).

## Problem Solved
- **Inequity:** Traditional certifications are expensive.
- **Trust:** Resumes can be faked.
- **Access:** Many assessment platforms are heavy and require high-end devices.

## The Solution
A lightweight, mobile-responsive web app where users:
1. Solve coding problems (Java/Python) in a secure, monitored environment.
2. Pass verification tests via the Judge0 Execution Sandbox.
3. Mint a "Skill Badge" on the blockchain as tamper-proof proof of competence.

## Security & Integrity (The "Red Team" Layer)
To ensure the value of our credentials, we implement a multi-layered defense:
- **Behavioral Analysis:** Keystroke velocity and focus tracking detect non-human typing patterns.
- **Sandboxed Execution:** All code is securely compiled via Judge0 API (Docker), isolating it from the client.
- **Immutable Trust:** Badges are Soulbound Tokens (SBTs) that cannot be transferred or sold, ensuring the holder is the earner.

## SDG Alignment
**SDG 4: Quality Education**
- **Target 4.4:** Increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment, decent jobs, and entrepreneurship.
- **Impact:** Provides free, accessible skill verification for students on low-end devices.

**Digital Inclusion (Technical Implementation)**
- Optimized for 3G networks and devices with low RAM (2GB).
- "Lite Mode" ensures sustainability by reducing energy/data consumption.
