import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../layout/service/layout.service';
import { KpiService } from '../services/kpi.service';

import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { DropdownItem, DropdownModule } from 'primeng/dropdown';

// interfaceはクラスの外側に記述する事
export interface FactoryOption {
    name: string;
    code: number;
}
export interface Dropdownitem {
    name: string;
    code: string;
}

export interface Kpi {
    factory_type: number;
    parts_no: string;
}

@Component({
    selector: 'app-test',
    standalone: true,
    imports: [ChartModule,DropdownModule,FluidModule,FormsModule,SelectButtonModule],
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']

})

export class Test implements OnInit, OnDestroy{

    // selectButtonの初期設定
    selectButtonValues: FactoryOption[] = [
        { name: '全工場',code:0},
        { name: 'Jupiter',code:1},
        { name: 'Mercury',code:2},
        { name: 'Tierra',code:4},
        { name: 'Luna',code:6},
        { name: 'Saturn',code:5}
    ];    
    selectButtonValue: FactoryOption = this.selectButtonValues[2];
    selectedNode: any = null;

    // dropdownlistの初期設定
    dropdownValues:  Dropdownitem[] = [];
    dropdownValue: Dropdownitem | null = null;

    // Chartの初期設定
    lineData: any;
    lineOptions: any;
    barData: any;
    barOptions: any;

    subscription: Subscription;
    constructor(
        private layoutService: LayoutService,
        private kpiService: KpiService
        ) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            this.initCharts();
        });
    }

    ngOnInit() {
        this.loadDropdownItems(this.selectButtonValue.code);

    }
    onFactoryChange() {
        this.loadDropdownItems(this.selectButtonValue.code)
    }
    ngAfterViewInit() {
        this.initCharts();
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.lineData = {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                    tension: 0.4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-200'),
                    tension: 0.4
                }
            ]
        };

        this.lineOptions = {
            maintainAspectRatio: false,     
            aspectRatio: 1.0,               // グラフの縦横比を調整(0に近い程、縦長になる)
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.barData = {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
            datasets: [
                {
                    label: '実績',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: '計画',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-200'),
                    data: [60, 60, 60, 60, 60, 60, 60]
                }
            ]
        };

        this.barOptions = {
            maintainAspectRatio: false,
            aspectRatio: 1.0,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

    }

    loadDropdownItems(factoryCode: number) {
        this.kpiService.getPartsNo(factoryCode).subscribe((items: Kpi[]) =>
        {
            this.dropdownValues = items.map(item => ({
                name: item.parts_no,
                code: item.parts_no
            }));
            this.dropdownValue = null;
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
