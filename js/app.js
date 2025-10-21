/**
 * Main application entry point
 */

class MessageGeneratorApp {
  constructor() {
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    console.log("🚀 Message Generator App Initializing...");

    // Check environment
    this.checkEnvironment();

    // Initialize components
    this.initializeComponents();

    // Set up error handling
    this.setupErrorHandling();

    console.log("✅ Message Generator App Ready!");
  }

  /**
   * Check environment and dependencies
   */
  checkEnvironment() {
    // Check for required APIs
    const requiredAPIs = ["Promise", "Map", "Set", "localStorage", "clipboard"];

    const missingAPIs = requiredAPIs.filter((api) => !(api in window));

    if (missingAPIs.length > 0) {
      console.warn("Missing APIs:", missingAPIs);
      Utils.showToast(
        "Beberapa fitur mungkin tidak tersedia di browser ini",
        "warning"
      );
    }

    // Check storage availability
    if (!storageManager.isAvailable) {
      Utils.showToast(
        "Penyimpanan lokal tidak tersedia. Beberapa fitur akan dinonaktifkan.",
        "error"
      );
    }
  }

  /**
   * Initialize all components
   */
  initializeComponents() {
    // Set up global error handler for unhandled promises
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      Utils.showToast("Terjadi kesalahan tak terduga", "error");
    });

    // Add beforeunload handler to save data
    window.addEventListener("beforeunload", () => {
      this.saveBeforeUnload();
    });

    // Initialize keyboard shortcuts help
    this.setupKeyboardShortcuts();

    // Initialize modal backdrop close
    this.setupModalBackdropClose();
  }

  /**
   * Set up global error handling
   */
  setupErrorHandling() {
    window.addEventListener("error", (event) => {
      console.error("Global error:", event.error);

      // Don't show toast for minor errors
      if (event.error.message.includes("ResizeObserver")) return;

      Utils.showToast("Terjadi kesalahan aplikasi", "error");
    });
  }

  /**
   * Save data before unload
   */
  saveBeforeUnload() {
    // Save current inputs
    const inputData = uiManager.getInputData();
    storageManager.set("saved_inputs", inputData);

    // Save progress
    uiManager.saveTodayProgress();
  }

  /**
   * Set up keyboard shortcuts help
   */
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Show help on F1
      if (e.key === "F1") {
        e.preventDefault();
        this.showModal('shortcutsModal');
      }
    });
  }

  /**
   * Modal Management Functions - ✅ DIPINDAH KE DALAM CLASS
   */
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    const modalContent = document.getElementById(modalId + 'Content');
    
    if (modal && modalContent) {
        modal.classList.remove('hidden');
        
        // Trigger animation
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
        
        // Add escape key listener
        this.addEscapeListener(modalId);
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const modalContent = document.getElementById(modalId + 'Content');
    
    if (modal && modalContent) {
        // Trigger exit animation
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        
        // Wait for animation to complete then hide
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 200);
    }
  }

  addEscapeListener(modalId) {
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            this.closeModal(modalId);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    
    document.addEventListener('keydown', escapeHandler);
    
    // Remove listener when modal closes
    setTimeout(() => {
        const checkModal = document.getElementById(modalId);
        if (checkModal.classList.contains('hidden')) {
            document.removeEventListener('keydown', escapeHandler);
        }
    }, 300);
  }

  setupModalBackdropClose() {
    document.addEventListener('click', (e) => {
        if (e.target.id === 'shortcutsModal' || e.target.id === 'aboutModal') {
            this.closeModal(e.target.id);
        }
    });
  }
}

// ✅ Global functions for HTML onclick handlers
window.showKeyboardShortcuts = () => {
  if (window.app) {
    window.app.showModal('shortcutsModal');
  }
};

window.showAbout = () => {
  if (window.app) {
    window.app.showModal('aboutModal');
  }
};

window.closeModal = (modalId) => {
  if (window.app) {
    window.app.closeModal(modalId);
  }
};

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new MessageGeneratorApp();
});

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = MessageGeneratorApp;
}
