import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogWorkgroupEditionComponent } from './catalog-workgroup-edition.component';

describe('CatalogWorkgroupEditionComponent', () => {
  let component: CatalogWorkgroupEditionComponent;
  let fixture: ComponentFixture<CatalogWorkgroupEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogWorkgroupEditionComponent]
    });
    fixture = TestBed.createComponent(CatalogWorkgroupEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
