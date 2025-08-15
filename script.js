
        let currentStake = 500;
        let currentOdds = 2.0;
        let currentSavingsRate = 0.25;

        function calculateStrategy() {
            // Get input values
            currentStake = parseFloat(document.getElementById('stakeAmount').value);
            currentOdds = parseFloat(document.getElementById('betOdds').value);
            currentSavingsRate = parseFloat(document.getElementById('savingsRate').value);

            // Validate inputs
            if (currentStake <= 0) {
                alert('Please enter a valid stake amount greater than 0');
                return;
            }

            // Update strategy info
            updateStrategyInfo();

            // Show results section
            document.getElementById('resultsSection').classList.add('show');
            document.getElementById('tabsContainer').classList.add('show');
            document.getElementById('strategyInfo').style.display = 'block';

            // Calculate and populate all tables
            populateTable('table20', 'summary20', 20);
            populateTable('table10', 'summary10', 10);
            populateTable('table5', 'summary5', 5);
        }

        function updateStrategyInfo() {
            const profit = currentStake * (currentOdds - 1);
            const savings = profit * currentSavingsRate;
            const nextBet = currentStake + (profit - savings);
            
            document.getElementById('strategyDetails').innerHTML = `
                <p><strong>Starting Amount:</strong> ₦${currentStake.toFixed(2)}</p>
                <p><strong>Bet Odds:</strong> ${currentOdds} (${currentOdds === 2.0 ? 'Double your money' : currentOdds + 'x your money'})</p>
                <p><strong>Savings Rate:</strong> ${(currentSavingsRate * 100).toFixed(0)}% of profit from each win (₦${savings.toFixed(2)} from ₦${profit.toFixed(2)} profit)</p>
                <p><strong>Strategy:</strong> After each win, save ${(currentSavingsRate * 100).toFixed(0)}% of profit and reinvest the remaining ${((1 - currentSavingsRate) * 100).toFixed(0)}% into the next bet</p>
                <p><strong>Example:</strong> Bet ₦${currentStake.toFixed(2)} → Win ₦${(currentStake * currentOdds).toFixed(2)} (total return) → Profit ₦${profit.toFixed(2)} → Save ${(currentSavingsRate * 100).toFixed(0)}% (₦${savings.toFixed(2)}) → Next bet ₦${nextBet.toFixed(2)}</p>
            `;
        }

        function calculateBettingStrategy(days) {
            let results = [];
            let currentBet = currentStake;
            let cumulativeSavings = 0;
            
            for (let day = 1; day <= days; day++) {
                let winnings = currentBet * currentOdds; // total return
                let profit = winnings - currentBet; // actual profit
                let dailySavings = profit * currentSavingsRate; // percentage of profit
                cumulativeSavings += dailySavings;
                
                let nextBet = currentBet + (profit - dailySavings); // original bet + remaining profit
                
                results.push({
                    day: day,
                    betAmount: currentBet,
                    winnings: winnings,
                    profit: profit,
                    dailySavings: dailySavings,
                    cumulativeSavings: cumulativeSavings,
                    nextBet: nextBet
                });
                
                currentBet = nextBet;
            }
            
            return results;
        }

        function populateTable(tableId, summaryId, days) {
            const results = calculateBettingStrategy(days);
            const tableBody = document.getElementById(tableId);
            const summaryDiv = document.getElementById(summaryId);
            
            tableBody.innerHTML = '';
            
            results.forEach((result, index) => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${result.day}</td>
                    <td class="bet-amount">₦${result.betAmount.toFixed(2)}</td>
                    <td class="profit">₦${result.profit.toFixed(2)}</td>
                    <td class="savings">₦${result.dailySavings.toFixed(2)} (${(currentSavingsRate * 100).toFixed(0)}%)</td>
                    <td class="savings">₦${result.cumulativeSavings.toFixed(2)}</td>
                    <td class="bet-amount">${index < results.length - 1 ? '₦' + result.nextBet.toFixed(2) : 'N/A'}</td>
                `;
            });
            
            const finalResult = results[results.length - 1];
            const totalMoney = finalResult.cumulativeSavings + finalResult.nextBet;
            const totalProfit = totalMoney - currentStake;
            
            summaryDiv.innerHTML = `
                <h3>💰 Complete Financial Breakdown after ${days} consecutive wins:</h3>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    <h4>🏦 Money Breakdown:</h4>
                    <p><strong>💵 Total Saved Money:</strong> <span class="savings">₦${finalResult.cumulativeSavings.toFixed(2)}</span></p>
                    <p><strong>🎯 Available for Next Bet:</strong> <span class="bet-amount">₦${finalResult.nextBet.toFixed(2)}</span></p>
                    <p><strong>📊 Total Money You Have:</strong> <span class="profit">₦${totalMoney.toFixed(2)}</span></p>
                </div>
                <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    <h4>📈 Profit Analysis:</h4>
                    <p><strong>🎯 Initial Investment:</strong> <span style="color: #6c757d;">₦${currentStake.toFixed(2)}</span></p>
                    <p><strong>💰 Total Profit Made:</strong> <span class="profit">₦${totalProfit.toFixed(2)}</span></p>
                    <p><strong>📊 Return on Investment:</strong> <span class="profit">${(totalProfit / currentStake * 100).toFixed(1)}%</span></p>
                </div>
                <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    <h4>🔄 What This Means:</h4>
                    <p>• You started with ₦${currentStake.toFixed(2)}</p>
                    <p>• You saved ₦${finalResult.cumulativeSavings.toFixed(2)} (secure money)</p>
                    <p>• You have ₦${finalResult.nextBet.toFixed(2)} ready for the next bet</p>
                    <p>• <strong>Total wealth created: ₦${totalMoney.toFixed(2)}</strong></p>
                </div>
            `;
        }

        function showTab(tabId) {
            // Hide all tabs
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            const tabButtons = document.querySelectorAll('.tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Show selected tab
            document.getElementById(tabId).classList.add('active');
            event.target.classList.add('active');
        }

        // Initialize with default calculation on page load
        document.addEventListener('DOMContentLoaded', function() {
            calculateStrategy();
        });
    